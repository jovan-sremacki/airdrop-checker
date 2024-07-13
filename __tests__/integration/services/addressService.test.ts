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
    jest.spyOn(airdropChecker as any, "getUsdVolume").mockResolvedValue(2000);

    try {
      const result = await airdropChecker.getAddressDetails(address);

      expect(result).toHaveProperty("volume");
      expect(result).toHaveProperty("uniqueContracts");
    } catch (error) {
      console.error("Integration test failed:", error);
      throw error;
    }
  });
});
