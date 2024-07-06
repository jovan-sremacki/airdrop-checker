import { getAddressDetails } from "../../backend/services/addressService";

jest.mock("../../backend/services/addressService");

test("should fetch transaction count for an address", async () => {
  const expectedTransactionCount = 25;
  const address = "0xdFd1656602DB564661522daAd0ADB0b98d581050";

  // Mock implementation
  (getAddressDetails as jest.Mock).mockResolvedValueOnce({
    address,
    transactionCount: expectedTransactionCount,
  });

  const details = await getAddressDetails(address);

  expect(details).toEqual({
    address,
    transactionCount: expectedTransactionCount,
  });

  expect(getAddressDetails).toHaveBeenCalledTimes(1);
  expect(getAddressDetails).toHaveBeenCalledWith(address);
});
