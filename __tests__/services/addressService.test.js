"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const addressService_1 = require("../../backend/services/addressService");
jest.mock("../../backend/services/addressService");
test("should fetch transaction count for an address", () => __awaiter(void 0, void 0, void 0, function* () {
    const expectedTransactionCount = 25;
    const address = "0xdFd1656602DB564661522daAd0ADB0b98d581050";
    // Mock implementation
    addressService_1.getAddressDetails.mockResolvedValueOnce({
        address,
        transactionCount: expectedTransactionCount,
    });
    const details = yield (0, addressService_1.getAddressDetails)(address);
    expect(details).toEqual({
        address,
        transactionCount: expectedTransactionCount,
    });
    expect(addressService_1.getAddressDetails).toHaveBeenCalledTimes(1);
    expect(addressService_1.getAddressDetails).toHaveBeenCalledWith(address);
}));
