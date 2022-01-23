import { Reimb } from "../entities";

export interface ReimbService{
    svcGetAllReimbs():Promise<Reimb[]>
    svcAddReimb(reimb:Reimb):Promise<Reimb>
    //getReimbByID(id: string): Promise<Reimb>
    svcDelReimb(reimb:Reimb):Promise<Reimb[]>
    svcApprove(reimb:Reimb):Promise<Reimb>
    svcDeny(reimb:Reimb):Promise<Reimb>
    
}