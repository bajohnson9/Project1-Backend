import { UserDao } from "../daos/user-dao";
import { User } from "../entities";
import { UserService } from "./user-service";

export class UserServiceImpl implements UserService{
    

    //dependency injections
    private userDao:UserDao;
    constructor(userDao:UserDao){
        this.userDao = userDao;
    }

    svcGetAllUsers(): Promise<User[]> {
        return this.userDao.getAllUsers();
    }

    svcAddUser(user: User): Promise<User> {
        return this.userDao.createUser(user);
    }

    svcDelUser(user: User): Promise<User[]> {
        return this.userDao.delUser(user);
    }
    /*
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
    */
}