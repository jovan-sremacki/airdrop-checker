import { parentPort, workerData } from 'worker_threads';
import { AssetTransfersResult } from 'alchemy-sdk';

interface WorkerData {
  transfers: AssetTransfersResult[];
  address: string;
}

parentPort?.on('message', ({ transfers, address }: WorkerData) => {
  const transactionTypes: { [key: string]: number } = {};

  for (const transfer of transfers) {
    if (transfer.from.toLowerCase() === address.toLowerCase()) {
      if (!transactionTypes[transfer.category]) {
        transactionTypes[transfer.category] = 0;
      }
      transactionTypes[transfer.category]++;
    }
  }

  const percentageOfTransactionTypes: { [key: string]: string } = {};

  for (const type in transactionTypes) {
    percentageOfTransactionTypes[type] = (
      (transactionTypes[type] / transfers.length) *
      100
    ).toFixed(2);
  }

  parentPort?.postMessage(percentageOfTransactionTypes);
});
