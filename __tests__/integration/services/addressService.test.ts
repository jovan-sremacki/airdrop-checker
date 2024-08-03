import AddressService from "../../../backend/services/AddressService";
import dotenv from "dotenv";
import BaseService from "../../../backend/services/BaseService";

dotenv.config({ path: ".env.test" }); // Load test environment variables

describe("AirdropChecker Integration Test", () => {
  const apiKey = process.env.API_KEY || "";
  const address = process.env.TESTING_ADDRESS || "";

  let airdropChecker: AddressService;
  let baseService: BaseService;

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
  });

  it("should calculate volume in ETH correctly", async () => {
    const transfers = await (airdropChecker as any).getTransfers(address);

    const volume = await airdropChecker["getVolumeInEth"](transfers, address);

    expect(volume).toBeCloseTo(0.002, 2);
  });
});
