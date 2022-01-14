import { User } from "../entities";

export interface LoginService{
    svcLogin(user:User):Promise<User>
    
}