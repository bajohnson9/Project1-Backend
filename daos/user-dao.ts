import { addRequest, Reimb, User } from "../entities";

export interface UserDao{
    createUser(user:User): Promise<User>
    getAllUsers(): Promise<User[]>
    delUser(user: User): Promise<User[]>
    login(user:User): Promise<User>
    updateUser(user:User): Promise<User>
    getUserByID(id: string): Promise<User>

    getStats(): Promise<string[]>
}