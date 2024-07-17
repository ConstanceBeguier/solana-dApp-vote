import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { SystemProgram } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { BN } from "bn.js";

import {
  getProgram,
  getVoterAddress
} from "../utils/program";
import { confirmTx, mockWallet, stringToU8Array16, stringToU8Array32 } from "../utils/helper";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCo, setIsCo] = useState(false);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const program = useMemo(() => {
    if (connection) {
      return getProgram(connection, wallet ?? mockWallet());
    }
  }, [connection, wallet]);
  useEffect(() => {
    connection && wallet ? setIsCo(true) : setIsCo(false);
  }, [connection, wallet]);
  useEffect(() => {
    if(proposals.length == 0){
      fetch_proposals();
    }
  }, [program]);

  const [proposals, setProposals] = useState([]);

  const fetch_proposals = async () => {
    const proposals = await program.account.proposal.all();
    // const sortedVotes = proposals.sort((a, b) => a.account.deadline - b.account.deadline);
    setProposals(proposals);
    

    // if(wallet && wallet.publicKey){
    //   const updatedVotes = await Promise.all(sortedVotes.map(async(vote) => {
    //     const voterAccountAddress = await getVoterAddress(vote.publicKey, wallet.publicKey);
    //     const voterInfo = await program.account.voter.fetchNullable(voterAccountAddress);
    //     return {
    //       ...vote,
    //       voterInfo: voterInfo
    //     };
    //   }));

    //   setProposals(updatedVotes);
    // }
  }

  const create_proposal = async (
    title,
    description,
    cr_start,
    cr_end,
    vr_start,
    vr_end,
    vs_start,
    vs_end,
  ) => {
    setError("");
    setSuccess("");
    try {
      const proposal = Keypair.generate();
      console.log(
        stringToU8Array16(title), 
        stringToU8Array32(description),
        cr_start,
        cr_end,
        vr_start,
        vr_end,
        vs_start,
        vs_end,
        proposal.publicKey,
        wallet
      )
      const txHash = await program.methods
        .createProposal(
          stringToU8Array16(title), 
          stringToU8Array32(description),
          new BN(cr_start),
          new BN(cr_end),
          new BN(vr_start),
          new BN(vr_end),
          new BN(vs_start),
          new BN(vs_end),
        )
        .accounts({
          proposal: proposal.publicKey,
          signer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([wallet, proposal])
        .rpc();
        console.log(`tx: ${txHash}`)
      await confirmTx(txHash, connection);

      fetch_proposals();
    } catch (err) {
      console.log("err", err);
      setError(err.message);
    }
  };

  const add_choice_for_one_proposal = async (choice, proposalPK) => {
    setError("");
    setSuccess("");
    try {

      const txHash = await program.methods
        .addChoiceForOneProposal(
          stringToU8Array16(choice),
        )
        .accounts({
          proposal: proposalPK,
          signer: wallet.publicKey,
        })
        .signers([wallet])
        .rpc();
      await confirmTx(txHash, connection);

      fetch_proposals();
    } catch (err) {
      console.log("err", err);
      setError(err.message);
    }
  };
  const register_voter = async (proposalPK) => {    
    setError("");
    setSuccess("");
    try {
      const ppAccountAddress = await getProposalAddress(proposalPK, wallet.publicKey);

      const txHash = await program.methods
        .registerVoter()
        .accounts({
          proposal: proposalPK,
          ballot: ppAccountAddress,
          voter: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([wallet])
        .rpc();
      await confirmTx(txHash, connection);

      fetch_proposals();
    } catch (err) {
      console.log("err", err);
      setError(err.message);
    }
  };
  const cast_vote = async (index, proposalPK) => {
    try {
      const ppAccountAddress = await getProposalAddress(proposalPK, wallet.publicKey);

      const txHash = await program.methods
      .castVote(index)
      .accounts({
        proposal: proposalPK,
        ballot: ppAccountAddress,
        voter: wallet.publicKey,
      })
      .signers([wallet])
      .rpc();
      await confirmTx(txHash, connection);

      fetch_proposals();
    } catch (err) {
      console.log("err", err);
      setError(err.message);
    }
  }
  return (
    <AppContext.Provider
      value={{
        create_proposal,
        fetch_proposals,
        cast_vote,
        register_voter,
        add_choice_for_one_proposal,
        proposals,
        error,
        success,
        isCo
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
