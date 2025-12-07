import cron from "node-cron";
import { pool } from "../config/db";

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Checking expired bookings...");

  try {
    const today = new Date().toISOString().split("T")[0]; 

    const expiredBookings = await pool.query(
      `SELECT * FROM bookings 
       WHERE rent_end_date < $1 
       AND status = 'active'`,
      [today]
    );

    if (expiredBookings.rows.length === 0) {
      console.log("No expired bookings found.");
      return;
    }


    for (const booking of expiredBookings.rows) {
      const bookingId = booking.id;
      const vehicleId = booking.vehicle_id;

      await pool.query(
        `UPDATE bookings SET status = 'returned' WHERE id = $1`,
        [bookingId]
      );

      await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [vehicleId]
      );
    }

  } catch (err: any) {
    console.error("Cron Job Error:", err.message);
  }
});
