import {
  Network,
  Alchemy,
  AssetTransfersCategory,
  RawContract,
  ERC1155Metadata,
  AssetTransfersResponse,
  AssetTransfersResult,
} from "alchemy-sdk";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const apiKey = process.env.API_KEY || "";
const settings = {
  apiKey: apiKey,
  network: Network.BASE_MAINNET,
};
const alchemy = new Alchemy(settings);

export const getAddressDetails = async (
  address: string
): Promise<{ volume: number; uniqueContracts: number | undefined }> => {
  try {
    const response = await getAssetTransfers(address);

    const volume = await getVolume(response.transfers, address);
    const uniqueContracts = (
      await getUniqueContractAddresses(response.transfers)
    )?.length;

    return { volume, uniqueContracts };
  } catch (error: any) {
    console.error("Error fetching address details: " + error.message);
    throw error;
  }
};

async function isContractAddress(addr: string): Promise<boolean> {
  return await alchemy.core.isContractAddress(addr);
}

async function getAssetTransfers(
  address: string
): Promise<AssetTransfersResponse> {
  try {
    return await alchemy.core.getAssetTransfers({
      fromAddress: address,
      excludeZeroValue: true,
      category: [
        AssetTransfersCategory.EXTERNAL,
        AssetTransfersCategory.ERC20,
        AssetTransfersCategory.ERC721,
        AssetTransfersCategory.ERC1155,
      ],
    });
  } catch (error: any) {
    console.error("Something went wrong " + error.message);
    throw error;
  }
}

/**
 * Calculates the total volume of tokens transferred from the specified address.
 *
 * @param transfers - An array of AssetTransfersResult objects representing the token transfers.
 * @param address - The address from which the volume should be calculated.
 * @returns A Promise that resolves to the total volume of tokens transferred from the specified address.
 */
async function getVolume(
  transfers: AssetTransfersResult[],
  address: string
): Promise<number> {
  return transfers.reduce((acc, item) => {
    if (item.from.toLowerCase() == address.toLowerCase()) {
      if (item.value) {
        return acc + item.value;
      }
    }
    return 0;
  }, 0);
}

/**
 * Fetches the contract address associated with the given address.
 *
 * @param addr - The address to fetch the contract address for.
 * @returns A Promise that resolves to the contract address if found, or null if not found.
 */
async function getContractAddresses(
  transfers: AssetTransfersResult[]
): Promise<Promise<string[] | null>> {
  return Promise.all(
    transfers.map(async (item) => {
      if (item.to && (await alchemy.core.isContractAddress(item.to))) {
        return item.to;
      }

      return null;
    })
  ).then((result) => {
    return result.filter((item): item is string => item !== null) as string[];
  });
}

/**
 * Fetches the unique contract addresses associated with the given address.
 *
 * @param transfers - An array of AssetTransfersResult objects representing the token transfers.
 * @returns A Promise that resolves to an array of unique contract addresses associated with the given address, or null if no contract addresses are found.
 */
async function getUniqueContractAddresses(
  transfers: AssetTransfersResult[]
): Promise<string[] | null> {
  const contractAddresses = await getContractAddresses(transfers);

  if (!contractAddresses) return null;

  return contractAddresses.reduce<string[]>((acc, addr) => {
    if (!acc.some((item) => item == addr)) {
      acc.push(addr);
    }
    return acc;
  }, []);
}
