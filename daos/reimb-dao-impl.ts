import { Reimb, ReimbursementStatus, User } from "../entities";
import { ReimbDao } from "./reimb-dao";
import { readFile, writeFile } from 'fs/promises';
import { v4 } from "uuid";
import { CosmosClient } from "@azure/cosmos";

//cosmos setup
const client = new CosmosClient(process.env.P1_COSMOS_DB);
const DB = client.database('project1-bajohnson');
const reimbsContainer = DB.container('reimbs')
const usersContainer = DB.container('users')

export class ReimbDaoImpl implements ReimbDao{

    async createReimb(reimb: Reimb): Promise<Reimb> {
        //add an ID via v4 and push
        try{
            const response = await reimbsContainer.items.create({...reimb, id: v4()})
            return response.resource;

        } catch (error) {
            console.error("cannot create reimb :(")
        }        
         
    }

    async getAllReimbs(): Promise<Reimb[]> {
        try{
            const response = await reimbsContainer.items.readAll<Reimb>().fetchAll();
            const reimbs:Reimb[] = response.resources ?? [];
            return reimbs;

        } catch (error) {
            console.error("cannot get all reimbs :(")
        }
    }

    async delReimb(reimb: Reimb): Promise<Reimb[]> {

        try {
            const delResponse = await reimbsContainer.item(reimb.id,reimb.id).delete<Reimb>()

            //remove reimb ID from all users
            const userResponse = await usersContainer.items.readAll<User>().fetchAll();
            const users:User[] = userResponse.resources ?? [];
            users.forEach(r => {
                if(r.reimbs.find(r => r === reimb.id)) {
                    // doesn't really delete it but ill do that later
                    r.reimbs[r.reimbs.findIndex(r => r === reimb.id)] = "";
                }
            })

            //get all reimbs for the return
            const reimbResponse = await reimbsContainer.items.readAll<Reimb>().fetchAll();
            const reimbs:Reimb[] = reimbResponse.resources;
            return reimbs;
            
        } catch(error) {console.error(error)}
    }

    async approveReimb(reimb: Reimb): Promise<Reimb> {
        
            
        try {
            
            //copy the item to be approved and approve it
            const tempReimb:Reimb = {...reimb, status:ReimbursementStatus.approved}
            const response = await reimbsContainer.items.upsert<Reimb>(tempReimb);
            return tempReimb;

        } catch (error) {
            console.error("couldn't approve reimb :(")
        }
        
    }

    async denyReimb(reimb: Reimb): Promise<Reimb> {
        
        try {
            
            //copy the item to be approved and approve it
            const tempReimb:Reimb = {...reimb, status:ReimbursementStatus.denied}
            const response = await reimbsContainer.items.upsert<Reimb>(tempReimb);
            return tempReimb;

        } catch (error) {
            console.error("couldn't approve reimb :(")
        }
    }
}