import { Request, Response } from "express";
import { getAddressDetails } from "../services/addressService";

export const addressDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { address } = req.params;

  try {
    const details = getAddressDetails(address);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: "Internal server errror" });
  }
};
