import { User } from "../entities";
import { UserDao } from "./user-dao";
import { readFile, writeFile } from 'fs/promises';
import { v4 } from "uuid";

export class UserDaoImpl implements UserDao{

    async createUser(user: User): Promise<User> {
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json');
        const text:string = await file.toString();
        const users:User[] = JSON.parse(text);
        user.id = v4();
        users.push(user);
        await writeFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json',JSON.stringify(users))
        return user;
    }

    async getAllUsers(): Promise<User[]> {


        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json');
        const text:string = await file.toString();
        const users:User[] = JSON.parse(text);
        return users;


    }
}