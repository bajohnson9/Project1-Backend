import { addRequest, Reimb, ReimbursementStatus, User } from "../entities";
import { UserDao } from "./user-dao";
import { readFile, writeFile } from 'fs/promises';
import { v4 } from "uuid";
import { Container, CosmosClient } from "@azure/cosmos";

//cosmos setup 
const client = new CosmosClient(process.env.P1_COSMOS_DB);
const DB = client.database('project1-bajohnson');
const usersContainer = DB.container('users')
const reimbsContainer = DB.container('reimbs')

//logging
const bunyan = require('bunyan')
const log = bunyan.createLogger({name:"User Logs",serializers: bunyan.stdSerializers})
const userError = new Error('Problem processing user(s)')

export class UserDaoImpl implements UserDao{

    async createUser(user: User): Promise<User> {

        try {
            const response = await usersContainer.items.create({...user, id: v4()});            
            log.info('User created with properties: ', {
                username: response.resource.username,
                password: response.resource.password,
                ID: response.resource.id
            })
            return response.resource;
            
        } catch (error) {log.error(userError, "cannot create user :(")}
        
    }

    async getAllUsers(): Promise<User[]> {

        try {
            const response = await usersContainer.items.readAll<User>().fetchAll();
            const users:User[] = response.resources;
            return users;
        
        } catch (error) { log.error(userError, "cannot get users :(") }

    }

    async getUserByID(id:string): Promise<User> {
        try{
            const response = await usersContainer.item(id,id).read<User>()

            return response.resource;
        } catch(error) { log.error(userError, "cannot get user by ID")}
    }

    async delUser(user: User): Promise<User[]> {
        try {
            const delResponse = await usersContainer.item(user.id,user.id).delete<User>()

            //get all users again for the return
            const response = await usersContainer.items.readAll<User>().fetchAll();
            const users:User[] = response.resources;
            log.info('User deleted with properties: ', {
                username: delResponse.resource.username,
                password: delResponse.resource.password,
                ID: delResponse.resource.id
            })
            return users;
            
        } catch(error) { log.error(userError, "cannot delete user")}
    }

    async updateUser(user: User): Promise<User> {
        try{
            const response = await usersContainer.items.upsert<User>(user);
            log.info('User updated with properties: ', {
                username: response.resource.username,
                password: response.resource.password,
                ID: response.resource.id,
                isManager: response.resource.isManager,
                isAuthenticated: response.resource.isAuthenticated,
                reimbs: response.resource.reimbs
            })
            return response.resource;

        } catch(error) { log.error(userError, "cannot add reimb to user")}
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
                  
            log.info('User logged in: ', {
                username: tempUser.username
            })
            return tempUser;

        } catch(error) {
            log.error(userError, "login failed")
        }
        
    }

    async getStats(): Promise<string[]> {
        const stats:string[] = [];
        //get users
        const response = await usersContainer.items.readAll<User>().fetchAll();
        const users:User[] = response.resources;
        //get reimbs
        const rResponse = await reimbsContainer.items.readAll<Reimb>().fetchAll();
        const reimbs:Reimb[] = rResponse.resources;

        //calc some stats
        //HIGHEST COST REIMB
        let highestAmt:Reimb = {type:"",desc:"",id:"",amount:0,status:ReimbursementStatus.pending};
        for(let i = 0; i < reimbs.length; i++){
            if(Number(highestAmt.amount) < Number(reimbs[i].amount)) { highestAmt = {...reimbs[i]}; }
        }
        let highestAmtUser:User = users.find(u => (u.reimbs.includes(highestAmt.id)))
        stats.push(`${highestAmtUser.username} has the highest costing reimbursement at $${highestAmt.amount}!`)

        //HIGHEST NUMBER OF REIMBS heh maybe fix before showcasing
        /*
        let mostReimbs:User = users[0];
        for(let i = 0; i < users.length; i++){
            if(mostReimbs.reimbs.length < users[i].reimbs.length) mostReimbs = users[i];
        }
        stats.push(`${mostReimbs.username} has the most reimbursements at ${mostReimbs.reimbs.length} reimbursements!`)
        */

        //HIGHEST TOTAL COST AMONG REIMBS
        let highestTotalAmtUser:User = users[0];
        let totalAmt:Number = 0;
        for(let i = 0; i < users.length; i++){
            let totalAmtTemp = 0;
            highestTotalAmtUser = users[i];
            //sum amounts for that user
            for (let id of highestTotalAmtUser.reimbs){
                const r = reimbs.find(r => r.id === id)
                if(r) totalAmtTemp += Number(r.amount) ?? 0;
            }
            //
            if(totalAmt < Number(totalAmtTemp)){
                totalAmt = totalAmtTemp;
                highestTotalAmtUser = users[i];
            }
        }
        stats.push(`${highestTotalAmtUser.username} has the highest total reimbursement cost at $${totalAmt}!!`)

        //OLDEST
        const oldestReimb = reimbs[0];
        let oldestReimbUser:User = users.find(u => (u.reimbs.includes(oldestReimb.id)))
        stats.push(`${oldestReimbUser.username} has the oldest reimbursement, a reimb for ${oldestReimb.desc}`)

        //NEWEST
        const newestReimb = reimbs[reimbs.length-1];
        let newestReimbUser:User = users.find(u => (u.reimbs.includes(newestReimb.id)))
        stats.push(`${newestReimbUser.username} has the newest reimbursement, a reimb for ${newestReimb.desc}`)

        return stats;
    }

}