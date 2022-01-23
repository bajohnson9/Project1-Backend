import { addRequest, Reimb, User } from "../entities";
import { UserDao } from "./user-dao";
import { readFile, writeFile } from 'fs/promises';
import { v4 } from "uuid";

export class UserDaoImplOld implements UserDao{

    async createUser(user: User): Promise<User> {
        
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\users.json');
        const text:string = file.toString();
        const users:User[] = JSON.parse(text);

        try {
        if(!users.find(u => u.id === user.id)) {
            user.id = v4();
            users.push(user);
        }
        
        } catch (error) {
            console.error("cannot create user :(")
        }
        
        await writeFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\users.json',JSON.stringify(users))
        return user;
        
    }

    async getUserByID(id:string): Promise<User> {
        try{

        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\users.json');
        const text:string = file.toString();
        const users:User[] = JSON.parse(text);

        let tempUser:User = users.find(u => u.id === id);
        return tempUser;
        } catch(error) {console.error("cannot get user by ID")}
    }

    async addReimbToUser(user: User,reimb:Reimb): Promise<User> {
        try{

        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\users.json');
        const text:string = file.toString();
        let users:User[] = JSON.parse(text);
        //update user
        const newUser:User = users.find(u => u.username === user.username);
        //add the thing
        newUser.reimbs.push(reimb.id);
        users[users.findIndex(u => u.username == newUser.username)] = newUser;
        await writeFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\users.json',JSON.stringify(users))
        return newUser;
        } catch(error) {console.error("cannot add reimb to user")}
    }

    async getAllUsers(): Promise<User[]> {

        try {
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\users.json');
        const text:string = file.toString();
        const users:User[] = JSON.parse(text);
        
        return users;

        } catch (error) { console.error("cannot get users :(") }

    }

    async delUser(user: User): Promise<User[]> {

        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\users.json');
        const text:string = file.toString();
        const users:User[] = JSON.parse(text);

        //move this part to services
        try{
        //get the user to be deleted
        const tempUser:User = users.find(r => r.username === user.username);
        
        //if not null, shift values AFTER this one up (covering it), reduce length by 1
        console.log("B4::::::::::::::::::::::::::::::::::::" + users);
        if(tempUser.username){
            users.forEach((element,index)=>{
                if(element.username==tempUser.username) users.splice(index,1);
            });
        }
        console.log("AFTA::::::::::::::::::::::::::::::::::" + users);
        } catch (error) {
            console.error("cannot create user :(")
        }
        
        await writeFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\localusers.json',JSON.stringify(users))
        return users;
    }

    async login(user:User): Promise<User> {
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\users.json');
        const text:string = file.toString();
        const users:User[] = JSON.parse(text);
        console.log(user)
        console.log(users)

        try{
        //find the correct user in the database
        const tempUser:User = users.find(u => u.username === user.username);
        if(tempUser.password === user.password) { return {...tempUser, isAuthenticated:true} }
        else return tempUser;
        } catch(error) {
            console.error("login failed")
        }
        
    }

    async getStats(): Promise<string[]> {
        
        let stats:string[] = [];
        //get users
        let file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\users.json');
        let text:string = file.toString();
        const users:User[] = JSON.parse(text);
        //get reimbs
        file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\reimbursements.json');
        text = file.toString();
        const reimbs:Reimb[] = JSON.parse(text);
        //come up with some whacky statistics!!!
        //maybe change this one to a sort
        let biggestAmt:Reimb = {...reimbs[0]};
        reimbs.forEach(r => {if(biggestAmt.amount < r.amount){biggestAmt = r}});
        stats.push("Reimbursement with the highest value: " + biggestAmt.desc)
        return(stats);
    }
}

//SOMETHING'S NOT BEING AWAITED UGH I GOT THIS:
/*

Promise {<pending>}
[[Prototype]]: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: Array(1)

*/