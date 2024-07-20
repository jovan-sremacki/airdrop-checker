import {
  Network,
  Alchemy,
  AssetTransfersCategory,
  AssetTransfersResponse,
  AssetTransfersResult,
  BigNumber,
} from "alchemy-sdk";
import dotenv from "dotenv";
import { ethers } from "ethers";

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

  public async getTransfers(address: string): Promise<AssetTransfersResult[]> {
    const transfers = await this.getAssetTransfers(address);

    return transfers.transfers;
  }

  public async getAddressDetails(address: string): Promise<{
    uniqueContracts: number | undefined;
    volumeInEth: number;
  }> {
    try {
      const response = await this.getAssetTransfers(address);

      const uniqueContracts = (
        await this.getUniqueContractAddresses(response.transfers)
      )?.length;
      const volume = await this.getVolumeInEth(response.transfers, address);

      return {
        uniqueContracts,
        volumeInEth: Math.round(volume),
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

  private async getVolumeInEth(
    transfers: AssetTransfersResult[],
    address: string
  ): Promise<number> {
    let volume = 0;

    for (const transfer of transfers) {
      if (
        transfer.from.toLowerCase() === address.toLowerCase() &&
        transfer.value
      ) {
        // we have to pull the value from the transaction hash since
        // we do not have that info within the transfer itself
        const transaction = await this.alchemy.core.getTransaction(
          transfer.hash
        );

        if (transaction && transaction.value) {
          volume += parseFloat(await this.toEther(transaction.value));
        }
      }
    }

    return volume;
  }

  private async calculatePercentageOfTransactionTypes(transfers: AssetTransfersResult[]) {
    const totalTransfers = transfers.length;
    const transactionTypes = {};

    console.log(transfers.filter(t => t.erc721TokenId !== null).length);
    
    // for (const transfer of transfers) {
    //   console.log(`Category: ${transfer.category}`);
    // }

    // for (const transfer of transfers) {
    //   if (!transactionTypes[transfer.category]) {
    //     transactionTypes[transfer.category] = 0;
    //   }
    //   transactionTypes[transfer.category]++;
    // }

    // const percentageOfTransactionTypes = {};

    // for (const type in transactionTypes) {
    //   percentageOfTransactionTypes[type] = (
    //     (transactionTypes[type] / totalTransfers) *
    //     100
    //   ).toFixed(2);
    // }

    // return percentageOfTransactionTypes;
  }

  private async toEther(value: BigNumber): Promise<string> {
    return ethers.formatEther(value.toString());
  }
}

export default AddressService;
