import dotenv from "dotenv";
dotenv.config(); // Load environment variables

const apiKey = process.env.API_KEY || "";
const url = `https://base-mainnet.g.alchemy.com/v2/${apiKey}`;

export const getAddressDetails = async (
  address: string
): Promise<{ address: string; transactionCount: number }> => {
  const options = {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      params: [address, "latest"],
      method: "eth_getTransactionCount",
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    console.log(`Response data: ${data.result}`);

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Convert transaction count from hexadecimal to decimal
    const transactionCount = parseInt(data.result, 16);

    return { address, transactionCount };
  } catch (error: any) {
    console.error("Error fetching address details: " + error.message);
    throw error;
  }
};
