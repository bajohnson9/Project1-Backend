import { ReimbDao } from "../daos/reimb-dao";
import { ReimbDaoImpl } from "../daos/reimb-dao-impl";
import { UserDaoImpl } from "../daos/user-dao-impl";
import { Reimb } from "../entities";
import { UserServiceImpl } from "../services/user-service-impl";

describe("Get reimb test", ()=>{
    const reimbDao: ReimbDao = new ReimbDaoImpl;
    const testReimb: Reimb =  {"id":"","type":"Collateral","desc":"Island leveled by local mad scientist","amount":31475844853,"status":"pending"}
    const r1 = {"id":"1", "type":"Food", "desc":"Two dozen hunks of meat", "amount":51, "status":"pending"}   
    const r2 = {id:"2", type:"Collateral", desc:"17 battleships destroyed", amount:5000000, status:"pending"}
    const r3 = {id:"3", type:"Tribute", desc:"Big Mom didn't pay up", amount:75000, status:"pending"}
    const r4 = {id:"4", type:"Collateral", desc:"9 Government cars", amount:1800000, status:"pending"} 
    

    it("Should create a Reimb", async ()=>{
        const returnedReimb: Reimb = await reimbDao.createReimb(testReimb);
        expect(returnedReimb.id).toBeTruthy();
    })

    it("Should return all reimbs", async ()=>{
        
        const reimbs = await reimbDao.getAllReimbs();
        const l = reimbs.length;

        await reimbDao.createReimb(r3)
        await reimbDao.createReimb(r4)

        const finalReimbs: Reimb[] = await reimbDao.getAllReimbs();
        expect(finalReimbs.length).toBe(l + 2);
        
    })

    it("Should delete a reimbursement", async ()=>{
        const reimbs = await reimbDao.getAllReimbs();
        const l = reimbs.length;

        await reimbDao.delReimb(reimbs.find(r => r.amount === 75000))
        await reimbDao.delReimb(reimbs.find(r => r.amount === 1800000))
        await reimbDao.delReimb(reimbs.find(r => r.amount === 31475844853))
        
        const reimbs2 = await reimbDao.getAllReimbs();
        expect(reimbs.length).toBe(reimbs2.length + 3);

    })

    it("Should approve a reimbursement", async ()=>{
        //copy it and approve
        await reimbDao.createReimb(r1); 
        let reimbs = await reimbDao.getAllReimbs();
        const reindex = reimbs.findIndex(r => r.id === r1.id);
        await reimbDao.approveReimb(r1);
        //make sure it approved
        reimbs = await reimbDao.getAllReimbs();
        expect(reimbs[reindex].status).toBe("approved")
            
        await reimbDao.delReimb(reimbs.find(r => r.amount === 51))
    })

    it("Should deny a reimbursement", async ()=>{
    
        await reimbDao.createReimb(r2);
        let reimbs = await reimbDao.getAllReimbs();
        const reindex = reimbs.findIndex(r => r.id === r2.id);
        await reimbDao.denyReimb(r2);

        reimbs = await reimbDao.getAllReimbs();
        expect(reimbs[reindex].status).toBe("denied")
        
        await reimbDao.delReimb(reimbs.find(r => r.amount === 5000000))
        
    })
})

