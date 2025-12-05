import { Request, Response } from "express";
import { BookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    
    const result = await BookingServices.createBooking(req.body);

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


export const bookingControllers = {
  createBooking,
  
};
