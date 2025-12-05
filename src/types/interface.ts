export interface IVehicle {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: string;
}

export interface IBooking {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  total_price: number;
  status: string;
  vehicle: IVehicleName;
}

export interface IVehicleName {
  vehicle_name: string;
  daily_rent_price: number;
}
