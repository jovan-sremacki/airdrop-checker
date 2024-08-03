import { AssetTransfersResult } from "alchemy-sdk";
import { Worker } from "worker_threads";
import path from "path";
import BaseService from "./BaseService";

class TransactionsService extends BaseService {
  public async calculatePercentageOfTransactionTypes(
    transfers: AssetTransfersResult[],
    address: string
  ): Promise<{ [key: string]: string }> {
    return new Promise((resolve, reject) => {
      const workerPath = path.resolve(__dirname, "../workers/transactionWorker.js");

      const worker = new Worker(workerPath, {
        workerData: { transfers, address },
      });

      worker.on("message", (percentageOfTransactionTypes) => {
        resolve(percentageOfTransactionTypes);
      });

      worker.on("error", (error) => {
        reject(error);
      });

      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });

      worker.postMessage({ transfers, address });
    });
  }
}

export default TransactionsService;
