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


export const getSingleBooking = async (id: string) => {
  const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [id]);
  return result;
};

const getAllBooking = async () => {
  
  const bookingsResult = await pool.query(`SELECT * FROM bookings`);
  // console.log(result.rows);
  const bookingsWithVehicle = await Promise.all(
    bookingsResult.rows.map(async(booking) =>{
      const vehicleResult = await pool.query(
        `SELECT vehicle_name, registration_number FROM vehicles WHERE id = $1`,[booking.vehicle_id]
      );

      const userResult = await pool.query(
        `SELECT name, email FROM users WHERE id = $1`,
        [booking.customer_id]
      );
      return {
        ...booking,
        customer: userResult.rows.length > 0 ? {
          name: userResult.rows[0].name,
          email: userResult.rows[0].email
        } : {},
        vehicle: vehicleResult.rows.length > 0 ? {
          vehicle_name: vehicleResult.rows[0].vehicle_name,
          registration_number: vehicleResult.rows[0].registration_number
        } : {}
        
      };
    })
  );

  
  
  return { rows: bookingsWithVehicle };
};
const getAllBookingCustomer = async (customerId: number) => {
  
  const bookingsResult = await pool.query(`SELECT * FROM bookings WHERE customer_id = $1`,
    [customerId]
  );
  // console.log(result.rows);
  const bookingsWithVehicle = await Promise.all(
    bookingsResult.rows.map(async(booking) =>{
      const vehicleResult = await pool.query(
        `SELECT vehicle_name, registration_number, type FROM vehicles WHERE id = $1`,[booking.vehicle_id]
      );

      const { customer_id, ...withOutCustomerId} = booking;

      return {
        ...withOutCustomerId,
        vehicle: vehicleResult.rows.length > 0 ? {
          vehicle_name: vehicleResult.rows[0].vehicle_name,
          registration_number: vehicleResult.rows[0].registration_number,
          type: vehicleResult.rows[0].type
        } : {}
        
      };
    })
  );

  
  
  return { rows: bookingsWithVehicle };
};

const updateBookingStatus = async(bookingId: string, status: string)=>{
 const result = await pool.query(
    `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING id, status`,
    [status, bookingId]
  );
  return result;
}

const updateBookingVehicleStatus = async(vehicleId: string, status: string)=>{
 const result = await pool.query(
    `UPDATE vehicles SET availability_status = $1 WHERE id = $2 RETURNING id, availability_status`,
    [status, vehicleId]
  );
  return result;
}
export const BookingServices = {
  createBooking,
  getAllBooking,
  getAllBookingCustomer,
  updateBookingVehicleStatus,
  updateBookingStatus,
  getSingleBooking
};
