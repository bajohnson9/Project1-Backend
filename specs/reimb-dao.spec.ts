import { ReimbDao } from "../daos/reimb-dao";
import { ReimbDaoImpl } from "../daos/reimb-dao-impl";
import { UserDaoImpl } from "../daos/user-dao-impl";
import { Reimb } from "../entities";
import { UserServiceImpl } from "../services/user-service-impl";

describe("Get reimb test", ()=>{
    const reimbDao: ReimbDao = new ReimbDaoImpl;
    let testReimb: Reimb = 
    {"id":"","type":"Collateral","desc":"Island leveled by local mad scientist","amount":31475844853,"status":"pending"}

    
    

    it("Should create a Reimb", async ()=>{
        const returnedReimb: Reimb = await reimbDao.createReimb(testReimb);
        expect(returnedReimb.id).toBeTruthy();
        //redundant comment vv
        //to use in later tests vvv AKA redundant
        testReimb = returnedReimb;

    })

    it("Should return all reimbs", async ()=>{
        
        const reimbs = await reimbDao.getAllReimbs();
        const l = reimbs.length;
        //need to import as an array (or is it an object with a name or is it the bgael)
        
        const r1 = {"id":"1", "type":"Food", "desc":"Two dozen hunks of meat", "amount":50, "status":"pending"}
        const r2 = {id:"2", type:"Collateral", desc:"17 battleships destroyed", amount:5000000, status:"denied"}
        const r3 = {id:"3", type:"Tribute", desc:"Big Mom didn't pay up", amount:75000, status:"pending"}
        const r4 = {id:"4", type:"Collateral", desc:"9 Government cars", amount:1800000, status:"approved"}

        await reimbDao.createReimb(r1)
        await reimbDao.createReimb(r2)
        await reimbDao.createReimb(r3)
        await reimbDao.createReimb(r4)

        const finalReimbs: Reimb[] = await reimbDao.getAllReimbs();
        //probably change the 3 here                 v
        expect(finalReimbs.length).toBe(l + 4);
        
        
    })

    it("Should delete a reimbursement", async ()=>{
        const reimbs = await reimbDao.getAllReimbs();
        const l = reimbs.length;
        
        await reimbDao.delReimb({"id":"1","type":"","desc":"","amount":0,"status":""})
        await reimbDao.delReimb({"id":"2","type":"","desc":"","amount":0,"status":""})
        await reimbDao.delReimb({"id":"3","type":"","desc":"","amount":0,"status":""})
        await reimbDao.delReimb({"id":"4","type":"","desc":"","amount":0,"status":""})
        
        const finalReimbs: Reimb[] = await reimbDao.getAllReimbs();

        expect(finalReimbs.length === (l - 4));

    })
    
})

