import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingControllers } from "./booking.controller";

const router = Router();
 // /api/v1
router.post("/", bookingControllers.createBooking);
router.get("/", auth("admin"), bookingControllers.getAllBooking);



export const bookingRoutes = router;