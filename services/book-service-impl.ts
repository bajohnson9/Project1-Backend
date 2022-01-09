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

    
}