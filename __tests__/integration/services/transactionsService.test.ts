import TransactionService from "../../../backend/services/TransactionsService";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" }); // Load test environment variables

describe("TransactionsService Integration Test", () => {
  const apiKey = process.env.API_KEY || "";
  const address = process.env.TESTING_ADDRESS || "";

  let transactionService: TransactionService;

  beforeAll(() => {
    transactionService = new TransactionService(apiKey);
  });

  describe("calculatePercentageOfTransactionTypes", () => {
    it("should calculate the percentage of transaction types", async () => {
      const transfers = await (transactionService as any).getTransfers(address);

      const percentageOfTransactionTypes =
        await transactionService.calculatePercentageOfTransactionTypes(
          transfers,
          address
        );

      expect(percentageOfTransactionTypes).toEqual({
        external: "87.50",
        erc20: "12.50",
      });
    });
  });
});
