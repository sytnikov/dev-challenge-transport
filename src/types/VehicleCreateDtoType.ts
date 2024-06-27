export type VehicleCreateDtoType = {
  route_number: string,
  reg_number: string,
  latitude: string,
  longitude: string,
  timestamp: Date,
  speed: number,
  operator: number,
  direction: string,
  distance?: number
}