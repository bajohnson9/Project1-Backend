import { ReimbDao } from "../daos/reimb-dao";
import { ReimbDaoImpl } from "../daos/reimb-dao-impl";
import { Reimb, ReimbursementStatus } from "../entities";


describe("Get reimb test", ()=>{
    const reimbDao: ReimbDao = new ReimbDaoImpl;
    let testReimb: Reimb = {"id":"","type":"Collateral","desc":"Island leveled by local mad scientist","amount":31475844853,"status":"pending"} 
    

    it("Should create a Reimb", async ()=>{
        const returnedReimb: Reimb = await reimbDao.createReimb(testReimb);
        expect(returnedReimb.id).toBeTruthy();
        expect(returnedReimb.type).toBeTruthy();
        expect(returnedReimb.desc).toBeTruthy();
        expect(returnedReimb.amount).toBeTruthy();
        expect(returnedReimb.status).toBeTruthy();
        //for future testing *rolls eyes*
        testReimb = {...returnedReimb}
    })

    it("Should return all reimbs", async ()=>{
        
        const reimbs:Reimb[] = await reimbDao.getAllReimbs();
        expect(reimbs.length).toBeGreaterThan(0);
    })

    it("Should delete a reimbursement", async ()=>{
        const reimbs = await reimbDao.getAllReimbs();
        const l = reimbs.length;
        //create user

        //delete user
        await reimbDao.delReimb(testReimb);

        //check length of users
        const reimbs2 = await reimbDao.getAllReimbs();
        expect(l).toEqual(reimbs2.length + 1);
    })

    it("Should approve a reimbursement", async ()=>{
        testReimb = await reimbDao.createReimb(testReimb);
        testReimb = await reimbDao.approveReimb(testReimb);
        expect(testReimb.status).toBe(ReimbursementStatus.approved);
    })

    it("Should deny a reimbursement", async ()=>{
        testReimb = await reimbDao.denyReimb(testReimb);
        expect(testReimb.status).toBe(ReimbursementStatus.denied);
        
    })
    afterAll(async ()=>{
        await reimbDao.delReimb(testReimb);
    })
})

