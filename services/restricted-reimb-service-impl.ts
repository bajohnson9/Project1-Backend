import { ReimbDao } from "../daos/reimb-dao";
import { Reimb } from "../entities";
import { ReimbService } from "./reimb-service";

export class RestrictedReimbServiceImpl implements ReimbService{
    

    //dependency injections
    private reimbDao:ReimbDao;
    constructor(ReimbDao:ReimbDao){
        this.reimbDao = ReimbDao;
    }

    svcGetAllReimbs(): Promise<Reimb[]> {
        return this.reimbDao.getAllReimbs();
    }

    svcAddReimb(reimb: Reimb): Promise<Reimb> {
        return this.reimbDao.createReimb(reimb);
    }

    svcDelReimb(reimb: Reimb): Promise<Reimb[]> {
        return this.reimbDao.getAllReimbs();
    }

    svcApprove(reimb: Reimb): Promise<Reimb[]> {
        return this.reimbDao.getAllReimbs();
    }
    
}