import { Request, Response } from "express";
import { VehicleServices } from "./vehicle.service";
import { JwtPayload } from "jsonwebtoken";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    // console.log("user: ", user);
    if (user.role === "admin") {
      const result = await VehicleServices.createVehicle(req.body);

      res.status(201).json({
        success: true,
        message: "Vehicle created successfully",
        data: result.rows[0],
      });
    } else {
      res.status(403).json({
        success: false,
        message: "You are not Allowed !",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getVehicle = async (req: Request, res: Response) => {
  try {
    const result = await VehicleServices.getVehicle();

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const id = req.params.vehicleId;
    console.log("Req.params.vehicleId: --", id);
    const result = await VehicleServices.getSingleVehicle(
      req.params.vehicleId as string
    );

    console.log("Result: ", result);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle fetch successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  try {
    const currentVehicle = await VehicleServices.getSingleVehicle(
      req.params.vehicleId as string
    );

    if (currentVehicle.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not Found !",
      });
    }

    const current = currentVehicle.rows[0];

    const result = await VehicleServices.updateVehicle(
      vehicle_name !== undefined ? vehicle_name : current.vehicle_name,
      type !== undefined ? type : current.type,
      registration_number !== undefined
        ? registration_number
        : current.registration_number,
      daily_rent_price !== undefined
        ? daily_rent_price
        : current.daily_rent_price,
      availability_status !== undefined
        ? availability_status
        : current.availability_status,
      req.params.vehicleId as string
    );

    console.log("result:- ", result.rows[0]);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found !",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle Updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleResult = await VehicleServices.getSingleVehicle(
      req.params.vehicleId as string
    );

    console.log("Result: ", vehicleResult.rows[0]);

    const availabilityStatus = vehicleResult.rows[0].availability_status;
    if (availabilityStatus === 'available') {
      const result = await VehicleServices.deleteVehicle(req.params.vehicleId!);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle Deleted successfully",
      });
    }
    } else {
      res.status(400).json({
        success: false,
        message: "This Vehicle already Booked !"
      })
    }
    
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const vehicleControllers = {
  createVehicle,
  getVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
