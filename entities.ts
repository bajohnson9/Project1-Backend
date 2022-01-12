
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
    //defunct until i learn how to pass enums through html
    status:string
}