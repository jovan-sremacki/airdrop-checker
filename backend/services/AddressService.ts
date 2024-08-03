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
import ContractService from "./ContractService";
import BaseService from "./BaseService";

dotenv.config(); // Load environment variables

class AddressService extends BaseService {
  public async getAddressDetails(address: string): Promise<{
    uniqueContracts: number | undefined;
    volumeInEth: number;
  }> {
    try {
      const transfers = await this.getTransfers(address);

      const uniqueContracts = (
        await ContractService.getUniqueContractAddresses(
          transfers,
          this.alchemy
        )
      )?.length;
      const volume = await this.getVolumeInEth(transfers, address);

      return {
        uniqueContracts,
        volumeInEth: Math.round(volume),
      };
    } catch (error: any) {
      console.error("Error fetching address details: " + error.message);
      throw error;
    }
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

  private async toEther(value: BigNumber): Promise<string> {
    return ethers.formatEther(value.toString());
  }
}

export default AddressService;
