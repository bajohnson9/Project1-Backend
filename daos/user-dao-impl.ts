import { User } from "../entities";
import { UserDao } from "./user-dao";
import { readFile, writeFile } from 'fs/promises';
import { v4 } from "uuid";

export class UserDaoImpl implements UserDao{

    async createUser(user: User): Promise<User> {
        
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json');
        const text:string = await file.toString();
        const users:User[] = JSON.parse(text);

        try {
        user.id = v4();
        users.push(user);
        } catch (error) {
            console.error("cannot create user :(")
        }
        
        await writeFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json',JSON.stringify(users))
        return user;
        
    }

    async getAllUsers(): Promise<User[]> {

        try {
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json');
        const text:string = await file.toString();
        const users:User[] = JSON.parse(text);
        
        return users;

        } catch (error) {
            console.error("cannot get users :(")
        }

    }

    async delUser(user: User): Promise<User[]> {

        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json');
        const text:string = await file.toString();
        const users:User[] = JSON.parse(text);

        //move this part to services
        try{
        //get the user to be deleted
        const tempUser:User = users.find(r => r.id === user.id);
        const id = tempUser.id;
        console.log(tempUser.id + " - " + user.id)
        
        //if not null, shift values AFTER this one up (covering it), reduce length by 1
        if(tempUser.id == user.id){
            
            for(let i = users.indexOf(tempUser);i < users.length; i++) users[i] = users[i+1];
            users.length = users.length - 1;
        }
        } catch (error) {
            console.error("cannot create user :(")
        }
        
        await writeFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json',JSON.stringify(users))
        return users;
    }
}