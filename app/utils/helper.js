export const mockWallet = () => {
  return {};
};

// export const shortenPk = (pk, chars = 5) => {
//   const pkStr = typeof pk === "object" ? pk.toBase58() : pk;
//   return `${pkStr.slice(0, chars)}...${pkStr.slice(-chars)}`;
// };

export const confirmTx = async (txHash, connection) => {
  const blockhashInfo = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: blockhashInfo.blockhash,
    lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
    signature: txHash,
  });
};

export const stringToU8Array16 = (input) => {
  const bytes = new TextEncoder().encode(input);

  if (bytes.length > 16) {
      throw new Error("Input string is too long");
  }

  const array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < bytes.length; i++) {
      array[i] = bytes[i];
  }

  return array;
}

export const stringToU8Array32 = (input) => {
  const bytes = new TextEncoder().encode(input);

  if (bytes.length > 32) {
      throw new Error("Input string is too long");
  }

  const array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < bytes.length; i++) {
      array[i] = bytes[i];
  }

  return array;
}