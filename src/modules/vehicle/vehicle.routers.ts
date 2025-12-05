import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = Router();
 // /api/v1
router.post("/vehicles",auth("admin"), vehicleControllers.createVehicle);
router.get("/vehicles", vehicleControllers.getVehicle);
router.get("/vehicles/:vehicleId", vehicleControllers.getSingleVehicle);


export const vehicleRoutes = router;