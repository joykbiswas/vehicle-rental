import { pool } from "../../config/db";
import { IVehicle } from "../../types/interface";

const createVehicle = async (payload: IVehicle) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status,]
  );

  return result;
};


const getVehicle = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

export const getSingleVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  return result;
};


const updateVehicle = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: string,
  id: string
) => {
  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
  );

  return result;
};

const updateVehicleStatus = async(vehicleId: string, status: string)=>{
 const result = await pool.query(
    `UPDATE vehicles SET availability_status = $1 WHERE id = $2 RETURNING id, availability_status`,
    [status, vehicleId]
  );
  return result;
}

const deleteVehicle = async (id: string) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
  return result;
};


export const VehicleServices = {
  createVehicle,
  getVehicle,
  getSingleVehicle,
  updateVehicle,
  updateVehicleStatus,
  deleteVehicle
};
