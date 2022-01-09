import { User } from "../entities";

export interface UserDao{
    createUser(user:User): Promise<User>
    getAllUsers(): Promise<User[]>
}