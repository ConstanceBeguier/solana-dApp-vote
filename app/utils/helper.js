import { PublicKey } from '@solana/web3.js';

export const mockWallet = () => {
  return {};
};

export const pubKeySplitting = (pk, chars = 5) => {
  const pkStr = typeof pk === "object" ? pk.toBase58() : pk;
  return `${pkStr.slice(0, chars)}...${pkStr.slice(-chars)}`;
};

export const confirmTx = async (txHash, connection) => {
  const blockhashInfo = await connection.getLatestBlockhash();
  return await connection.confirmTransaction({
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

/**
 * 
 * @param {Array<number>} array 
 * @returns {string}
 */
export const u8ArrayToString = (array) => {
  const decoder = new TextDecoder('utf-8');
  const standardArray = Array.from(array);
  let endIndex = standardArray.indexOf(0);
  if (endIndex === -1) endIndex = array.length;
  return decoder.decode(new Uint8Array(standardArray.slice(0, endIndex)));
}

/**
 * Checks if a string is a valid Solana public key.
 * @param {string} pubkeyString - La chaîne à vérifier.The string to check.
 * @returns {boolean} - Returns true if the string is a valid public key, otherwise false.
 */
export const isValidPublicKey = (pubkeyString) => {
  try {
    new PublicKey(pubkeyString);
    return true;
  } catch (error) {
    return false;
  }
}

export const toCamelCase = (text) => {
    const words = text.split(' ');

  const camelCaseWords = words.map((word, index) => {
      if (index === 0) {
          return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return camelCaseWords.join('');
}