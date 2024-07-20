import AddressService from "../../../backend/services/AddressService";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" }); // Load test environment variables

describe("AirdropChecker Integration Test", () => {
  const apiKey = process.env.API_KEY || "";
  const address = process.env.TESTING_ADDRESS || "";

  let airdropChecker: AddressService;

  beforeAll(() => {
    airdropChecker = new AddressService(apiKey);
  });

  it("should fetch address details correctly", async () => {
    try {
      const result = await airdropChecker.getAddressDetails(address);

      expect(result).toHaveProperty("volumeInEth");
      expect(result).toHaveProperty("uniqueContracts");
    } catch (error) {
      console.error("Integration test failed:", error);
      throw error;
    }
  }, 15000);

  it("should calculate volume in ETH correctly", async () => {
    const transfers = await airdropChecker.getTransfers(address);

    const volume = await airdropChecker["getVolumeInEth"](transfers, address);

    expect(volume).toBeCloseTo(0.002, 2);
  });

  it("should calculate percentage of transaction types", async () => {
    const transfers = await airdropChecker.getTransfers(address);

    console.log(`Numbers of transfers: ${transfers.length}`);

    const percentageOfTransactionTypes = await airdropChecker[
      "calculatePercentageOfTransactionTypes"
    ](transfers);
  });
});
