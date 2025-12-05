import { pool } from "../../config/db";
import { IBooking } from "../../types/interface";
import { VehicleServices } from "../vehicle/vehicle.service";

const createBooking = async (payload: IBooking) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleResult = await VehicleServices.getSingleVehicle(
    vehicle_id.toString()
  );
  // console.log("vehicleResult", vehicleResult);

  const vehicle = vehicleResult.rows[0];
  console.log("Vehicle: ", vehicle);

  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not Available For Booking");
  }
  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const total_price = days * vehicle.daily_rent_price;

  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  const booking = result.rows[0];
  const response = {
    ...booking,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };

  return response;
};

export const BookingServices = {
  createBooking,
};
