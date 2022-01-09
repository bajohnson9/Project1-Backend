
export interface User{
    username:string,
    password:string,
    id:string,
    isAuthenticated:boolean,
    isManager:boolean,
    //a string of reimb IDs (which ones are mine)
    reimbs: string[]
}