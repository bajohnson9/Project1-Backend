import { Reimb, ReimbursementStatus } from "../entities";
import { ReimbDao } from "./reimb-dao";
import { readFile, writeFile } from 'fs/promises';
import { v4 } from "uuid";

export class ReimbDaoImpl implements ReimbDao{

    async createReimb(reimb: Reimb): Promise<Reimb> {
        
        const file = await readFile('C:\\Users\\brook\\Documents\\REVATURE LAPTOP\\project1\\P1 Backend\\Project1-Backend\\reimbursements.json');
        const text:string = file.toString();
        const reimbs:Reimb[] = JSON.parse(text);
        
        try{
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
        console.log(reimbs)
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
        const tempReimb:Reimb = reimbs.find(r => r.desc === reimb.desc);
        const desc = tempReimb.desc; //unused?
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
            //copy, approve, and replace the correct reimbursement
            const tempReimb:Reimb = reimbs.find(r => r.id === reimb.id);
            tempReimb.status = ReimbursementStatus.approved;
            reimbs[reimbs.findIndex(r => r.id == tempReimb.id)] = tempReimb;

        } catch (error) {
            console.error("couldn't approve reimb :(")
        }

        return reimbs;
    }
}