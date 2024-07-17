import { AnchorProvider, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

import IDL from "./idl.json";
import {
  PROGRAM_ID,
} from "./constants";

export const getProgram = (connection, wallet) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  const program = new Program(IDL, PROGRAM_ID, provider);
  return program;
};

export const getVoterAddress = async (votePublicKey, userPublicKey) => {
  return (
    await PublicKey.findProgramAddress(
      [votePublicKey.toBuffer(), userPublicKey.toBuffer()],
      PROGRAM_ID
    )
  )[0];
};