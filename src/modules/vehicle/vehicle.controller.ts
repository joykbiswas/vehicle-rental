import { Request, Response } from "express";
import { VehicleServices } from "./vehicle.service";
import { JwtPayload } from "jsonwebtoken";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    console.log("user: ", user);
    if (user.role === "admin") {
      const result = await VehicleServices.createVehicle(req.body);

      res.status(201).json({
        success: true,
        message: "Vehicle created successfully",
        data: result.rows[0],
      });
    }else{
        res.status(403).json({
            success: false,
            message: "You are not Allowed !"
        })
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
    const result = await VehicleServices.getSingleVehicle(req.params.vehicleId as string);

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

// const updateUser = async (req: Request, res: Response) => {
//   const { name, email, phone } = req.body;

//   try {
//     const result = await userServices.updateUser(
//       name,
//       email,
//       phone,
//       req.params.id!
//     );

//     if (result.rows.length === 0) {
//       res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     } else {
//       res.status(200).json({
//         success: false,
//         message: "User Updated successfully",
//         data: result.rows[0],
//       });
//     }
//   } catch (err: any) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// const deleteUser = async (req: Request, res: Response) => {
//   try {
//     const result = await userServices.deleteUser(req.params.id!);
//     if (result.rowCount === 0) {
//       res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     } else {
//       res.status(200).json({
//         success: true,
//         message: "User Deleted successfully",
//         data: result.rows,
//       });
//     }
//   } catch (err: any) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

export const vehicleControllers = {
  createVehicle,
  getVehicle,
  getSingleVehicle
  //   updateUser,
  //   deleteUser,
};
