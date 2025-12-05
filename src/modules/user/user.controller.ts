import { Request, Response } from "express";
import { userServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();

    const removePass = result.rows.map((user) => {
      const { password, ...removesPass } = user;
      return removesPass;
    });
    console.log("removePass", removePass);

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: removePass,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { name, email, phone, role } = req.body;
  const { userId } = req.params;
  const currentUser = req.user as JwtPayload;

  try {
    if (currentUser.role === "admin") {
      const result = await userServices.updateUser(
        name,
        email,
        phone,
        role,
        req.params.userId!
      );

      const user = result.rows[0];
      delete user.password;

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "User Updated successfully",
          data: result.rows[0],
        });
      }

      // Customer
    } else if (currentUser.role === "customer") {
      if (Number(currentUser.id) !== Number(userId)) {
        return res
          .status(403)
          .json({ error: "You can only update your own profile" });
      } else {
        if (role && role !== "customer") {
          return res.status(400).json({
            success: false,
            message: "You cannot change your role. Role must remain 'customer'",
          });
        }
        const result = await userServices.updateUser(
          name,
          email,
          phone,
          role,
          req.params.userId!
        );

        const user = result.rows[0];
        delete user.password;

        if (result.rows.length === 0) {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "User Updated successfully",
            data: result.rows[0],
          });
        }
      }
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.userId!);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User Deleted successfully",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const userControllers = {
  getUser,
  updateUser,
  deleteUser,
};
