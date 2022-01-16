import { Reimb, User } from "../entities";
import { UserDao } from "./user-dao";
import { readFile, writeFile } from 'fs/promises';
import { v4 } from "uuid";

export class UserDaoImpl implements UserDao{

    async createUser(user: User): Promise<User> {
        
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json');
        const text:string = file.toString();
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

    async addReimbToUser(user: User,reimb:Reimb): Promise<User> {
        
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json');
        const text:string = file.toString();
        const users:User[] = JSON.parse(text);
        
        try {
        //update the user and write it back
        let tempUser:User = users.find(u => u.id === user.id);
        
        //update user
        tempUser.reimbs.push(reimb.id);
        users[users.findIndex(u => u.id === user.id)] = tempUser;

        } catch (error) {
            console.error("cannot add reimb for some reason")
        }

        await writeFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json',JSON.stringify(users))
        return user;

    }

    async getAllUsers(): Promise<User[]> {

        try {
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json');
        const text:string = file.toString();
        const users:User[] = JSON.parse(text);
        
        return users;

        } catch (error) {
            console.error("cannot get users :(")
        }

    }

    async delUser(user: User): Promise<User[]> {

        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json');
        const text:string = file.toString();
        const users:User[] = JSON.parse(text);

        //move this part to services
        try{
        //get the user to be deleted
        const tempUser:User = users.find(r => r.username === user.username);
        
        //if not null, shift values AFTER this one up (covering it), reduce length by 1
        if(tempUser.username == user.username){
            for(let i = users.indexOf(tempUser);i < users.length; i++) users[i] = users[i+1];
            users.length = users.length - 1;
        }
        } catch (error) {
            console.error("cannot create user :(")
        }
        
        await writeFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json',JSON.stringify(users))
        return users;
    }

    async login(user:User): Promise<User> {
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json');
        const text:string = file.toString();
        const users:User[] = JSON.parse(text);

        try{
        //find the correct user in the database
        const tempUser:User = users.find(u => u.username === user.username);
        if(tempUser.password === user.password) { return {...tempUser, isAuthenticated:true} }
        else return tempUser;
        } catch(error) {
            console.error("login failed")
        }
        
    }
}