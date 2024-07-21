
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as assert from 'assert';
import BN from 'bn.js';
import { SolanaDappVote } from "../target/types/solana_dapp_vote";

function stringToU8Array16(input: string): [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] {
    const bytes = new TextEncoder().encode(input);

    if (bytes.length > 16) {
        throw new Error("Input string is too long");
    }

    const array: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < bytes.length; i++) {
        array[i] = bytes[i];
    }

    return array;
}

function stringToU8Array32(input: string): [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] {
    const bytes = new TextEncoder().encode(input);

    if (bytes.length > 32) {
        throw new Error("Input string is too long");
    }

    const array: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < bytes.length; i++) {
        array[i] = bytes[i];
    }

    return array;
}

describe.skip("functional testing", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.SolanaDappVote as Program<SolanaDappVote>;
    const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

    it("Full workflow", async () => {
        // Create proposal keypair
        const admin = anchor.web3.Keypair.generate();
        // console.log(`Admin pubkey: `, admin.publicKey.toBase58());

        // Create voters keypairs
        const voter0 = anchor.web3.Keypair.generate();
        const voter1 = anchor.web3.Keypair.generate();
        const voter2 = anchor.web3.Keypair.generate();
        // console.log(`Voter0 pubkey: `, voter0.publicKey.toBase58());
        // console.log(`Voter1 pubkey: `, voter1.publicKey.toBase58());
        // console.log(`Voter2 pubkey: `, voter2.publicKey.toBase58());

        // Airdrops
        let txAdmin = await connection.requestAirdrop(
            admin.publicKey,
            5 * anchor.web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(txAdmin);
        let txVoter0 = await connection.requestAirdrop(
            voter0.publicKey,
            5 * anchor.web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(txVoter0);
        let txVoter1 = await connection.requestAirdrop(
            voter1.publicKey,
            5 * anchor.web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(txVoter1);
        let txVoter2 = await connection.requestAirdrop(
            voter2.publicKey,
            5 * anchor.web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(txVoter2);

        // Show balances
        const balanceAdmin = await connection.getBalance(admin.publicKey);
        // console.log(`Admin balance: ${balanceAdmin / anchor.web3.LAMPORTS_PER_SOL} SOL`);
        const balanceVoter0 = await connection.getBalance(voter0.publicKey);
        // console.log(`Voter0 balance: ${balanceVoter0 / anchor.web3.LAMPORTS_PER_SOL} SOL`);
        const balanceVoter1 = await connection.getBalance(voter1.publicKey);
        // console.log(`Voter1 balance: ${balanceVoter1 / anchor.web3.LAMPORTS_PER_SOL} SOL`);
        const balanceVoter2 = await connection.getBalance(voter2.publicKey);
        // console.log(`Voter2 balance: ${balanceVoter2 / anchor.web3.LAMPORTS_PER_SOL} SOL`);

        //  Create a proposal
        const proposal = Keypair.generate();
        // console.log(`Proposal pubkey: `, proposal.publicKey.toBase58());
        const proposalTitle = stringToU8Array16("title test");
        const proposalDesc = stringToU8Array32("desc test");
        let txCreateProposal = await program.methods
            .createProposal(proposalTitle, proposalDesc, new BN(0), new BN(1), new BN(1), new BN(2), new BN(2), new BN(3))
            .accounts({
                proposal: proposal.publicKey,
                admin: admin.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([admin, proposal])
            .rpc();
        // console.log(`Use 'solana confirm -v ${txCreateProposal}' to see the logs`);
        await connection.confirmTransaction(txCreateProposal);

        // Add choice c0
        const label0 = stringToU8Array16("c0");
        let txChoice0 = await program.methods
            .addChoiceForOneProposal(label0)
            .accounts({
                proposal: proposal.publicKey,
                admin: admin.publicKey,
            }).signers([admin])
            .rpc();
        // console.log(`Use 'solana confirm -v ${txChoice0}' to see the logs`);
        await connection.confirmTransaction(txChoice0);

        //  Add choice c1
        const label1 = stringToU8Array16("c1");
        let txChoice1 = await program.methods
            .addChoiceForOneProposal(label1)
            .accounts({
                proposal: proposal.publicKey,
                admin: admin.publicKey,
            }).signers([admin])
            .rpc();
        // console.log(`Use 'solana confirm -v ${txChoice1}' to see the logs`);
        await connection.confirmTransaction(txChoice1);

        // Register voter0
        const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
            [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
            program.programId
        );
        let txRegisterVoter0 = await program.methods
            .registerVoter(voter0.publicKey)
            .accounts({
                proposal: proposal.publicKey,
                ballot: ballot0AccountAddr,
                admin: admin.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([admin])
            .rpc();
        // console.log(`Use 'solana confirm -v ${txRegisterVoter0}' to see the logs`);
        await connection.confirmTransaction(txRegisterVoter0);

        //  Register voter1
        const [ballot1AccountAddr, bump1] = await PublicKey.findProgramAddress(
            [proposal.publicKey.toBuffer(), voter1.publicKey.toBuffer()],
            program.programId
        );
        let txRegisterVoter1 = await program.methods
            .registerVoter(voter1.publicKey)
            .accounts({
                proposal: proposal.publicKey,
                ballot: ballot1AccountAddr,
                admin: admin.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([admin])
            .rpc();
        // console.log(`Use 'solana confirm -v ${txRegisterVoter1}' to see the logs`);
        await connection.confirmTransaction(txRegisterVoter1);

        // Cast vote for voter0
        let txCastVote0 = await program.methods
            .castVote(1)
            .accounts({
                proposal: proposal.publicKey,
                ballot: ballot0AccountAddr,
                voter: voter0.publicKey,
            })
            .signers([voter0])
            .rpc();
        // console.log(`Use 'solana confirm -v ${txCastVote0}' to see the logs`);
        await connection.confirmTransaction(txCastVote0);

        // Cast vote for voter1
        let txCastVote1 = await program.methods
            .castVote(1)
            .accounts({
                proposal: proposal.publicKey,
                ballot: ballot1AccountAddr,
                voter: voter1.publicKey,
            })
            .signers([voter1])
            .rpc();
        // console.log(`Use 'solana confirm -v ${txCastVote1}' to see the logs`);
        await connection.confirmTransaction(txCastVote1);

        // Check proposal result
        const proposalResult = await program.account.proposal.fetch(
            proposal.publicKey
        );
        // console.log(`Proposal result: `, proposalResult);

        assert.strictEqual(
            proposalResult.choices[0].count,
            0
        );
        assert.strictEqual(
            proposalResult.choices[1].count,
            2
        );
    });
});
