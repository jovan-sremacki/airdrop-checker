import { Alchemy, AssetTransfersResult, Network } from "alchemy-sdk";

class ContractService {
  public static async getUniqueContractAddresses(
    transfers: AssetTransfersResult[],
    alchemy: Alchemy
  ): Promise<string[] | null> {
    const contractAddresses = await this.getContractAddresses(
      transfers,
      alchemy
    );

    if (!contractAddresses) return null;

    return contractAddresses.reduce<string[]>((acc, addr) => {
      if (!acc.some((item) => item === addr)) {
        acc.push(addr);
      }
      return acc;
    }, []);
  }

  private static async getContractAddresses(
    transfers: AssetTransfersResult[],
    alchemy: Alchemy
  ): Promise<string[] | null> {
    const contractAddresses = await Promise.all(
      transfers.map(async (item) => {
        if (item.to && (await alchemy.core.isContractAddress(item.to))) {
          return item.to;
        }
        return null;
      })
    );
    return contractAddresses.filter((item): item is string => item !== null);
  }
}

export default ContractService;
