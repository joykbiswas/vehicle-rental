import { Request, Response } from "express";
import { BookingServices } from "./booking.service";

// import { vehicleControllers } from "../vehicle/vehicle.controller";
import { VehicleServices } from "../vehicle/vehicle.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await BookingServices.createBooking(req.body);

    if (req.body.vehicle_id) {
      await VehicleServices.updateVehicleStatus(req.body.vehicle_id, "booked");
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
  const currentUser = req.user as JwtPayload;
  console.log("currentUser", currentUser);

  try {
    if (currentUser.role === "admin") {
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
    } else if (currentUser.role === "customer") {
      // Pass the customer ID to get only their bookings
      const result = await BookingServices.getAllBookingCustomer(
        currentUser.id
      );

      if (result.rows.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No Data found",
          data: [],
        });
      }

      res.status(200).json({
        success: true,
        message: "Your bookings retrieved successfully",
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const UpdateBookingStatus = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;
  console.log("Req Body: ", req.body);
  console.log("Req.Params: ", req.params.bookingId);
  try {
    const bookingResult = await BookingServices.getSingleBooking(
      req.params.bookingId as string
    );
    console.log("Booking Result:", bookingResult.rows[0]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const vehicleID = bookingResult.rows[0].vehicle_id;
    const booking = bookingResult.rows[0];

    if (
      currentUser.role === "customer" &&
      booking.customer_id !== currentUser.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own bookings",
      });
    }

    const vehicleResult = await BookingServices.updateBookingVehicleStatus(
      vehicleID as string,
      "available"
    );

    console.log("V Result: ", vehicleResult.rows);

    if (vehicleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (currentUser.role === "admin") {
      const responseData = {
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: "returned",
        vehicle: {
          availability_status: vehicleResult.rows[0].availability_status,
        },
      };

      res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: responseData,
      });
    } else if (currentUser.role === "customer") {
      const responseData = {
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: "cancelled", 
      };

      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully. Vehicle is now available",
        data: responseData,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBooking,
  UpdateBookingStatus,
};
