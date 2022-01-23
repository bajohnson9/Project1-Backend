import { ReimbDao } from "../daos/reimb-dao";
import { ReimbDaoImpl } from "../daos/reimb-dao-impl";
import { UserDao } from "../daos/user-dao";
import { UserDaoImpl } from "../daos/user-dao-impl";
import { Reimb, User } from "../entities";

describe("User get test", ()=>{
    const userDao: UserDao = new UserDaoImpl;
    const reimbDao: ReimbDao = new ReimbDaoImpl;
    let testUser: User = 
    {username:'testmanager',password:'password',id:'',isAuthenticated:true,isManager:true,reimbs:[]}

    
    

    it("Should create and get a User", async ()=>{
        //create user
        const returnedUser: User = await userDao.createUser(testUser);
        expect(returnedUser.id).toBeTruthy();
        expect(returnedUser.username).toBe('testmanager');
        //get that user (including the new ID)
        testUser = await userDao.getUserByID(returnedUser.id);
        expect(testUser.username).toBeTruthy();
        
    })

    it("Should return all users", async ()=>{
        //try testing without reimbs/other vars, etc
        const returnedUsers: User[] = await userDao.getAllUsers();
        expect(returnedUsers.length).toBeGreaterThan(0);
        
    })

    it("Should create then delete a User", async ()=>{

        const users = await userDao.getAllUsers();
        const l = users.length;
        
        //create user
        const testUserDel = await userDao.createUser(testUser)
        //delete user
        await userDao.delUser(testUserDel);

        //check length of users
        const users2 = await userDao.getAllUsers();
        expect(l).toEqual(users2.length);
    })

    it("Should add a new reimb ID to the user.reimbs property", async ()=>{
        const reimbs:Reimb[] = await reimbDao.getAllReimbs();
        const l = testUser.reimbs.length;
        

        //create new reimb
        let testReimb = {id:"", type:"Collateral", desc:"4 battleships destroyed", amount:1176470, status:"pending"}
        testReimb = await reimbDao.createReimb(testReimb);
        //add reimb to user                     user v      reimb v

        testUser.reimbs.push(testReimb.id);
        testUser = await userDao.updateUser(testUser);

        expect(testUser.reimbs.length).toBe(l + 1);

        await reimbDao.delReimb(testReimb)

        
    })

    it("Should log in when the password is correct", async ()=>{
        
        expect(await userDao.login(testUser)).toBeTruthy();
        
    })
    
    it("Should NOT log in when the password is incorrect", async ()=>{
        //maybe make a fake user anyway even if it doesnt really matter
        expect(await userDao.login({username:'',password:'',id:'',isAuthenticated:false,isManager:false,reimbs:[]})).not.toBeTruthy();
    })

    it("Should get he stats", async ()=>{
        expect(await userDao.getStats()).toHaveLength
    })

    afterAll(async ()=>{
        await userDao.delUser(testUser);
        
    })
})

