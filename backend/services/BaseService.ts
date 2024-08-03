import {
  Alchemy,
  AlchemySettings,
  AssetTransfersCategory,
  AssetTransfersResponse,
  AssetTransfersResult,
  Network,
} from "alchemy-sdk";

class BaseService {
  protected alchemy: Alchemy;

  constructor(apiKey: string, network: Network = Network.BASE_MAINNET) {
    const settings: AlchemySettings = {
      apiKey: apiKey,
      network: network,
    };
    this.alchemy = new Alchemy(settings);
  }

  /**
   * Fetch asset transfers for a given address.
   * @param address - The address to fetch transfers for.
   * @returns A promise that resolves to an array of AssetTransfersResult.
   */
  protected async getTransfers(
    address: string
  ): Promise<AssetTransfersResult[]> {
    const transfers = await this.getAssetTransfers(address);
    return transfers.transfers;
  }

  /**
   * Internal method to fetch asset transfers using Alchemy's API.
   * @param address - The address to fetch transfers for.
   * @returns A promise that resolves to an AssetTransfersResponse.
   */
  private async getAssetTransfers(
    address: string
  ): Promise<AssetTransfersResponse> {
    try {
      console.log(`Alchemy object is ${this.alchemy}`);
    } catch (error: any) {
      console.error("There is something wrong with this object");
    }

    try {
      return await this.alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: address,
        excludeZeroValue: false,
        category: [
          AssetTransfersCategory.EXTERNAL,
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.ERC1155,
        ],
      });
    } catch (error: any) {
      console.error("Error fetching asset transfers:", error);
      throw new Error("Failed to fetch asset transfers");
    }
  }
}

export default BaseService;
