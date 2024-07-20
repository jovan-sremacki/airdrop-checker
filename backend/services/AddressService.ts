import {
  Network,
  Alchemy,
  AssetTransfersCategory,
  AssetTransfersResponse,
  AssetTransfersResult,
} from "alchemy-sdk";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

class AddressService {
  private alchemy: Alchemy;

  constructor(apiKey: string) {
    const settings = {
      apiKey: apiKey,
      network: Network.BASE_MAINNET,
    };
    this.alchemy = new Alchemy(settings);
  }

  public async getAddressDetails(address: string): Promise<{
    uniqueContracts: number | undefined;
    volume: number;
  }> {
    try {
      const response = await this.getAssetTransfers(address);

      const uniqueContracts = (
        await this.getUniqueContractAddresses(response.transfers)
      )?.length;
      const volume = await this.getUsdVolume(response.transfers, address);

      return {
        uniqueContracts,
        volume: Math.round(volume),
      };
    } catch (error: any) {
      console.error("Error fetching address details: " + error.message);
      throw error;
    }
  }

  private async getAssetTransfers(
    address: string
  ): Promise<AssetTransfersResponse> {
    try {
      return await this.alchemy.core.getAssetTransfers({
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

  private async getVolume(
    transfers: AssetTransfersResult[],
    address: string
  ): Promise<number> {
    return transfers.reduce((acc, item) => {
      if (item.from.toLowerCase() == address.toLowerCase()) {
        if (item.value) {
          return acc + item.value;
        }
      }
      return acc;
    }, 0);
  }

  private async getContractAddresses(
    transfers: AssetTransfersResult[]
  ): Promise<string[] | null> {
    const contractAddresses = await Promise.all(
      transfers.map(async (item) => {
        if (item.to && (await this.alchemy.core.isContractAddress(item.to))) {
          return item.to;
        }
        return null;
      })
    );
    return contractAddresses.filter((item): item is string => item !== null);
  }

  private async getUniqueContractAddresses(
    transfers: AssetTransfersResult[]
  ): Promise<string[] | null> {
    const contractAddresses = await this.getContractAddresses(transfers);

    if (!contractAddresses) return null;

    return contractAddresses.reduce<string[]>((acc, addr) => {
      if (!acc.some((item) => item == addr)) {
        acc.push(addr);
      }
      return acc;
    }, []);
  }

  private async getUsdVolume(
    transfers: AssetTransfersResult[],
    address: string
  ): Promise<number> {
    let usdVolume = 0;

    for (const transfer of transfers) {
      if (
        transfer.from.toLowerCase() == address.toLowerCase() &&
        transfer.value
      ) {
        const tokenPrice = await this.getTokenPriceInUsd();
        usdVolume += transfer.value * tokenPrice;
      }
    }

    return usdVolume;
  }

  private async getTokenPriceInUsd(): Promise<number> {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
      );
      return response.data["ethereum"].usd || 0;
    } catch (error: any) {
      console.error("Error fetching token price: " + error.message);
      return 0;
    }
  }
}

export default AddressService;
