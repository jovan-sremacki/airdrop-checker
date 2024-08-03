const { parentPort } = require("worker_threads");

parentPort?.on("message", ({ transfers, address }) => {
  const transactionTypes = {};

  for (const transfer of transfers) {
    if (transfer.from.toLowerCase() === address.toLowerCase()) {
      if (!transactionTypes[transfer.category]) {
        transactionTypes[transfer.category] = 0;
      }
      transactionTypes[transfer.category]++;
    }
  }

  const percentageOfTransactionTypes = {};

  for (const type in transactionTypes) {
    percentageOfTransactionTypes[type] = (
      (transactionTypes[type] / transfers.length) *
      100
    ).toFixed(2);
  }

  parentPort?.postMessage(percentageOfTransactionTypes);
  parentPort?.close();
});
