import { addRequest, Reimb, User } from "../entities";
import { UserDao } from "./user-dao";
import { readFile, writeFile } from 'fs/promises';
import { v4 } from "uuid";
import { Container, CosmosClient } from "@azure/cosmos";

//cosmos setup 
const client = new CosmosClient(process.env.P1_COSMOS_DB);
const DB = client.database('project1-bajohnson');
const usersContainer = DB.container('users')
const reimbsContainer = DB.container('reimbs')

export class UserDaoImpl implements UserDao{

    async createUser(user: User): Promise<User> {

        try {
            const response = await usersContainer.items.create({...user, id: v4()});            
            return response.resource;
            
        } catch (error) {console.error("cannot create user :(")}
        
    }

    async getAllUsers(): Promise<User[]> {

        try {
            const response = await usersContainer.items.readAll<User>().fetchAll();
            const users:User[] = response.resources;
            return users;
        
        } catch (error) { console.error("cannot get users :(") }

    }

    async getUserByID(id:string): Promise<User> {
        try{
            const response = await usersContainer.item(id,id).read<User>()

            return response.resource;
        } catch(error) {console.error("cannot get user by ID")}
    }

    async delUser(user: User): Promise<User[]> {
        try {
            const delResponse = await usersContainer.item(user.id,user.id).delete<User>()

            //get all users again for the return
            const response = await usersContainer.items.readAll<User>().fetchAll();
            const users:User[] = response.resources;
            return users;
            
        } catch(error) {console.error(error)}
    }

    async updateUser(user: User): Promise<User> {
        try{
            const response = await usersContainer.items.upsert<User>(user);
            return response.resource;

        } catch(error) {console.error("cannot add reimb to user")}
    }    

    async login(user:User): Promise<User> {
        try{
            const response = await usersContainer.items.readAll<User>().fetchAll();
            const users:User[] = response.resources;
        
            //find the correct user in the database
            let tempUser:User = users.find(u => u.username === user.username) ?? user;
            if(tempUser.password === user.password) { 
                tempUser = {...tempUser, isAuthenticated:true};
                await usersContainer.items.upsert<User>(tempUser);
            }        
            
            return tempUser;

        } catch(error) {
            console.error("login failed")
        }
        
    }

    async getStats(): Promise<string[]> {
        
        let stats:string[] = [];
        //get users
        const userResponse = await usersContainer.items.readAll<User>().fetchAll();
        const users:User[] = userResponse.resources;
        //get reimbs
        const reimbResponse = await reimbsContainer.items.readAll<Reimb>().fetchAll();
        const reimbs:Reimb[] = reimbResponse.resources;
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