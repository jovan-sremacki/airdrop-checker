import { Network, Alchemy, AssetTransfersCategory } from "alchemy-sdk";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const apiKey = process.env.API_KEY || "";
const settings = {
  apiKey: apiKey,
  network: Network.BASE_MAINNET,
};

export const getAddressDetails = async (address: string): Promise<void> => {
  try {
    const alchemy = new Alchemy(settings);

    const response = await alchemy.core.getAssetTransfers({
      fromAddress: address,
      excludeZeroValue: true,
      category: [
        AssetTransfersCategory.EXTERNAL,
        AssetTransfersCategory.ERC20,
        AssetTransfersCategory.ERC721,
      ],
    });

    const volume = response.transfers.reduce((acc, item) => {
      if (item.from.toLowerCase() == address.toLowerCase()) {
        if (item.value) {
          return acc + item.value;
        }
      }
      return 0;
    }, 0);
  } catch (error: any) {
    console.error("Error fetching address details: " + error.message);
    throw error;
  }
};
