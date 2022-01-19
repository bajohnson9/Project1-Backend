import { Reimb, ReimbursementStatus } from "../entities";
import { ReimbDao } from "./reimb-dao";
import { readFile, writeFile } from 'fs/promises';
import { v4 } from "uuid";

export class ReimbDaoImpl implements ReimbDao{

    async createReimb(reimb: Reimb): Promise<Reimb> {
        
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\reimbursements.json');
        const text:string = file.toString();
        const reimbs:Reimb[] = JSON.parse(text);
        
        //add an ID and push
        try{
        if(!reimbs.find(r => r.id === reimb.id)) 
            reimb.id = v4();
        reimbs.push(reimb);
        } catch (error) {
            console.error("cannot create reimb :(")
        }

        await writeFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\reimbursements.json',JSON.stringify(reimbs))
        return reimb;
        
         
    }

    async getAllReimbs(): Promise<Reimb[]> {
        //this one tests EVERYTHING, not just the logic
        try{

        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\reimbursements.json');
        const text:string = file.toString();
        const reimbs:Reimb[] = JSON.parse(text);
        return reimbs;

        } catch (error) {
            console.error("cannot get all reimbs :(")
        }
    }

    async delReimb(reimb: Reimb): Promise<Reimb[]> {
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\reimbursements.json');
        const text:string = file.toString();
        const reimbs:Reimb[] = JSON.parse(text);
        

        // MOVE THIS TO SERVICES but dont break it
        try {
        //get the reimb to be deleted
        const tempReimb:Reimb = reimbs.find(r => r.id === reimb.id);
        
        //if not null, shift values AFTER this one up (covering it), reduce length by 1
        if(tempReimb.id === reimb.id){
            for(let i = reimbs.indexOf(tempReimb);i < reimbs.length; i++) reimbs[i] = reimbs[i+1];
            reimbs.length = reimbs.length - 1;
        }
        } catch (error) {
            console.error("reimb not found and/or other stupe errore :(")
        }

        await writeFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\reimbursements.json',JSON.stringify(reimbs))
        return reimbs;
    }

    async approveReimb(reimb: Reimb): Promise<Reimb[]> {
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\reimbursements.json');
        const text:string = file.toString();
        const reimbs:Reimb[] = JSON.parse(text);
            
        try {
            //copy the item to be approved and approve it
            const tempReimb:Reimb = reimbs.find(r => r.id === reimb.id);
            tempReimb.status = ReimbursementStatus.approved;

            //copy reimbs, put the approved item in
            const tempReimbs = reimbs;
            tempReimbs[tempReimbs.findIndex(r => r.id == tempReimb.id)] = tempReimb;
            
            await writeFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\reimbursements.json',JSON.stringify(tempReimbs))

        } catch (error) {
            console.error("couldn't approve reimb :(")
        }
        return reimbs;
    }

    async denyReimb(reimb: Reimb): Promise<Reimb[]> {
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\reimbursements.json');
        const text:string = file.toString();
        const reimbs:Reimb[] = JSON.parse(text);
            
        try {
            //copy the item to be approved and approve it
            const tempReimb:Reimb = reimbs.find(r => r.id === reimb.id);
            tempReimb.status = ReimbursementStatus.denied;

            //copy reimbs, put the approved item in
            const tempReimbs = reimbs;
            tempReimbs[tempReimbs.findIndex(r => r.id == tempReimb.id)] = tempReimb;
            
            await writeFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\reimbursements.json',JSON.stringify(tempReimbs))

        } catch (error) {
            console.error("couldn't deny reimb :(")
        }

        return reimbs;
    }
}