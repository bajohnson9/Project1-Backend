import { UserDao } from "../daos/user-dao";
import { Reimb, User } from "../entities";
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
    svcLogin(user: User): Promise<User> {
        return this.userDao.login(user);
    }
    svcAddReimbToUser(user: User, reimb:Reimb): Promise<User> {
        user.reimbs.push(reimb.id);
        return this.userDao.updateUser(user);    
    }
    getUserByID(id:string): Promise<User> {
        return this.userDao.getUserByID(id);
    }
    getStats(): Promise<string[]> {
        return this.userDao.getStats();
    }
}