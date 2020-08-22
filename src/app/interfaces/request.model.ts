import { AdResponse, AgentResponse } from './adResponse.model';

export interface Request {
  id: string;
  ad: AdResponse;
  agent: AgentResponse
  simpleUser: SimpleUserResponse
  requestStatus: string;
  pickUpAddress: string;
  pickUpDate: string;
  pickUpTime: string;
  returnDate: string;
  returnTime: string;
}

export interface SimpleUserResponse {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  userRole: string;
}
