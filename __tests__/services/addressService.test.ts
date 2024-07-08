import { getAddressDetails } from "../../backend/services/addressService";

jest.mock("../../backend/services/addressService");

test("should fetch total volume transactions along with number of contracts, last active, and how old is the account", async () => {
  const totalVolume = 1000;
  const numberOfInteractedContracts = 25;
  const gasSpent = 0.2;
  const lastActive = 12512325123; // timestamp
  const activity = 1823984219; // timestamp

  const address = "0xdFd1656602DB564661522daAd0ADB0b98d581050";

  // Mock implementation
  (getAddressDetails as jest.Mock).mockResolvedValueOnce({
    address,
    totalVolume,
    numberOfInteractedContracts,
    gasSpent,
    lastActive,
    activity,
  });

  const details = await getAddressDetails(address);

  expect(details).toEqual({
    address,
    totalVolume,
    numberOfInteractedContracts,
    gasSpent,
    lastActive,
    activity,
  });

  expect(getAddressDetails).toHaveBeenCalledTimes(1);
  expect(getAddressDetails).toHaveBeenCalledWith(address);
});
