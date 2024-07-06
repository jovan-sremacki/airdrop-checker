// src/routes/addressRoutes.ts
import { Router } from "express";
import { addressDetails } from "../controllers/addressController";

const router: Router = Router();

router.get("/:address", addressDetails);

export default router;
