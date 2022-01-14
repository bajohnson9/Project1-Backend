import { UserDao } from "../daos/user-dao";
import { User } from "../entities";
import { LoginService } from "./login-service";

export class LoginServiceImpl implements LoginService{
    

    //dependency injections
    private userDao:UserDao;
    constructor(userDao:UserDao){
        this.userDao = userDao;
    }

    async svcLogin(user: User): Promise<User> {
        const users:User[] = await this.userDao.getAllUsers();
        const username = "manager";
        const password = "password";
        
        let tempUser = users.find(u => (u.username === username));
        if(tempUser.password === password){
            tempUser.isAuthenticated = true;
        }
        //or maybe return a boolean
        return tempUser;
    }
}