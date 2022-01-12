import { Reimb } from "../entities";

export interface ReimbService{
    svcGetAllReimbs():Promise<Reimb[]>
    svcAddReimb(reimb:Reimb):Promise<Reimb>
    svcDelReimb(reimb:Reimb):Promise<Reimb[]>
    svcApprove(reimb:Reimb):Promise<Reimb[]>
}