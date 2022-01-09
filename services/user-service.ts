import { User } from "../entities";

export interface UserService{
    svcGetAllUsers():Promise<User[]>
    svcAddUser(user:User):Promise<User>

}