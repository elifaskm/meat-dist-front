import { User } from "./user.model";

export interface CheckTokenResponse{
  user: User;
  token: string;
}
