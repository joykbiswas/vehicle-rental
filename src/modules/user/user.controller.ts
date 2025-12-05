import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
//  const { name, email, age, phone, address } = req.body;
  try {
    const result = await userServices.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "Data Instered successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getSingleUser(req.params.id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User fetch successfully",
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

export const userControllers = {
  createUser,
  getUser,
  getSingleUser,
//   updateUser,
//   deleteUser,
};
