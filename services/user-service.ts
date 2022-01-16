import { Reimb, User } from "../entities";

export interface UserService{
    svcGetAllUsers():Promise<User[]>
    svcAddUser(user:User):Promise<User>
    svcDelUser(user:User):Promise<User[]>
    svcLogin(user:User):Promise<User>
    svcAddReimb(user:User,reimb:Reimb):Promise<User>
}