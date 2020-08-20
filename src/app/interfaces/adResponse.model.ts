export interface AdResponse {
  id: string;
  car: CarResponse;
  agent: AgentResponse;
  photos: PhotoResponse[];
  limitedDistance: boolean;
  availableKilometersPerRent: string;
  seats: number;
  creationDate: string;
}

export interface CarResponse {
  id: string;
  carModel: CarModelResponse;
  gearshiftType: string;
  numberOfGears: string;
  fuelType: string;
  kilometersTravelled: string;
}

export interface CarModelResponse {
  id: string;
  modelName: string;
  brandName: string;
  brandCountry: string;
  className: string;
}

export interface AgentResponse {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  address: string;
  userRole: string;
}

export interface PhotoResponse {
  id: string;
  name: string;
  type: string;
  picByte: any;
}
