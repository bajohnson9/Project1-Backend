
export interface User{
    username:string,
    password:string,
    id:string,
    isAuthenticated:boolean,
    isManager:boolean,
    //a string of reimb IDs (which ones are mine)
    reimbs: string[]
}

//defunct
export enum ReimbursementStatus {
    pending = 'pending', 
    denied = 'denied', 
    approved = 'approved' 
}


export interface Reimb{
    id:string,
    type:string,
    desc:string,
    amount:number,
    //status:ReimbursementStatus
    status:string
}

export interface addRequest{
    user:User;
    reimb:Reimb;
}