import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingControllers } from "./booking.controller";

const router = Router();
 // /api/v1
router.post("/", bookingControllers.createBooking);



export const bookingRoutes = router;