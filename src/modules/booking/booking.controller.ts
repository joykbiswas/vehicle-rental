import { Request, Response } from "express";
import { BookingServices } from "./booking.service";

// import { vehicleControllers } from "../vehicle/vehicle.controller";
import { VehicleServices } from "../vehicle/vehicle.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await BookingServices.createBooking(req.body);

    if (req.body.vehicle_id) {
      await VehicleServices.updateVehicleStatus(
        req.body.vehicle_id,
        "booked"
      );
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
    
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const getAllBooking = async (req: Request, res: Response) => {
  try {
    const result = await BookingServices.getAllBooking();

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Data found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBooking,
  
};
