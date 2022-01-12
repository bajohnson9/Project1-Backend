import { Reimb } from "../entities";

export interface ReimbDao{
    createReimb(reimb:Reimb): Promise<Reimb>
    getAllReimbs(): Promise<Reimb[]>
    delReimb(reimb:Reimb): Promise<Reimb[]>
    approveReimb(reimb:Reimb): Promise<Reimb[]>
}