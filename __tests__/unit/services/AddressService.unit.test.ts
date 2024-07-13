import { before } from "node:test";
import AddressService from "../../../backend/services/AddressService"; // Adjust the import path as necessary
import axios from "axios";

jest.mock("axios");

describe("AddressService Unit Tests", () => {
  const apiKey = "test-api-key";
  let addressService: AddressService;

  beforeEach(() => {
    addressService = new AddressService(apiKey);
  });

  describe("getVolume", () => {
    it("should calculate the correct volume", async () => {
      const transfers = [
        { from: "0x1234", value: 100 },
        { from: "0x2356", value: 200 },
        { from: "0x1234", value: 300 },
      ] as any;

      const volume = await addressService["getVolume"](transfers, "0x1234");

      expect(volume).toBe(400);
    });
  });

  describe("getUniqueContractAddresses", () => {
    before(() => {
      jest
        .spyOn(addressService as any, "getContractAddresses")
        .mockResolvedValue([
          "0xContractAddress1",
          "0xContractAddress2",
          "0xContractAddress1",
        ]);
    });

    it("should identify unique contract addresses", async () => {
      const transfers = [
        { to: "0xContractAddress1" },
        { to: "0xContractAddress2" },
        { to: "0xContractAddress1" },
      ] as any;

      const uniqueContracts = await addressService[
        "getUniqueContractAddresses"
      ](transfers);
      expect(uniqueContracts).toEqual([
        "0xContractAddress1",
        "0xContractAddress2",
      ]);
    });
  });

  describe("getTokenPriceInUsd", () => {
    it("should fetch the correct token price", async () => {
      const mockResponse = { data: { ethereum: { usd: 2000 } } };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const price = await addressService["getTokenPriceInUsd"]();
      expect(price).toBe(2000);
    });

    it("should handle API errors gracefully", async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error("API error"));

      const price = await addressService["getTokenPriceInUsd"]();
      expect(price).toBe(0);
    });
  });
});
