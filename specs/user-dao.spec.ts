import { ReimbDao } from "../daos/reimb-dao";
import { ReimbDaoImpl } from "../daos/reimb-dao-impl";
import { UserDao } from "../daos/user-dao";
import { UserDaoImpl } from "../daos/user-dao-impl";
import { Reimb, User } from "../entities";

describe("User get test", ()=>{
    const userDao: UserDao = new UserDaoImpl;
    let testUser: User = 
    {username:'testmanager',password:'password',id:'',isAuthenticated:true,isManager:true,reimbs:[]}

    
    

    it("Should create and get a User", async ()=>{
        const returnedUser: User = await userDao.createUser(testUser);
        expect(returnedUser.id).toBeTruthy();

        testUser = await userDao.getUserByID(returnedUser.id);
    })

    it("Should return all users", async ()=>{
        const users = await userDao.getAllUsers();
        const l = users.length; 
        //need to import as an array (or is it an object with a name or is it the bgael)
        const user1:User = {
            username:'testmgr',
            password:'password',
            id:'',
            isAuthenticated:true,
            isManager:true,
            reimbs:[]
        }
        const user2:User = {username:'testemp',password:'password',id:'',isAuthenticated:true,isManager:false,reimbs:[]}
        //test without reimbs/other vars                      ---------------                       test without reimbs/other vars
        const user3:User = {username:'testhacker',password:'password',id:'',isAuthenticated:false,isManager:false,reimbs:[]}
        await userDao.createUser(user1)
        await userDao.createUser(user2)
        await userDao.createUser(user3)

        const returnedUsers: User[] = await userDao.getAllUsers();
        //probably change the 3 here                 v
        expect(returnedUsers.length).toBe(l + 3);
        
        await userDao.delUser(user2);
        await userDao.delUser(user1);
        await userDao.delUser(user3);   
    })

    it("Should delete a User (3 to be precise)", async ()=>{

        //need to delete all their reimbs too
        const users = await userDao.getAllUsers();
        const l = users.length;
        
        await userDao.delUser({username:'testmgr',password:'password',id:'',isAuthenticated:true,isManager:true,reimbs:[]})
        await userDao.delUser({username:'testemp',password:'password',id:'',isAuthenticated:true,isManager:true,reimbs:[]})
        await userDao.delUser({username:'testhacker',password:'password',id:'',isAuthenticated:true,isManager:true,reimbs:[]})
        
        
        const users2 = await userDao.getAllUsers();

        expect(users2.length === (l - 3));

    })

    it("Should add a new reimb ID to the user.reimbs property", async ()=>{
        const reimbDao: ReimbDao = new ReimbDaoImpl;
        const reimbs:Reimb[] = await reimbDao.getAllReimbs();
        const l = testUser.reimbs.length;
        console.log(testUser)

        //create new reimb
        let testReimb = {id:"", type:"Collateral", desc:"4 battleships destroyed", amount:1176470, status:"pending"}
        testReimb = await reimbDao.createReimb(testReimb);
        

        //add reimb to user                     user v      reimb v
        testUser = await userDao.addReimbToUser(testUser, reimbs.find(r=> (r.desc === "4 battleships destroyed")));
        console.log(testUser)

        expect(testUser.reimbs.length).toBe(l + 1);
        
    })

    it("Should log in when the password is correct", async ()=>{
        expect(await userDao.login(testUser)).toBeTruthy();
    })
    
    it("Should NOT log in when the password is incorrect", async ()=>{
        expect(await userDao.login({username:'',password:'',id:'',isAuthenticated:false,isManager:false,reimbs:[]})).not.toBeTruthy();
    })

    it("Should get he stats", async ()=>{
        expect(await userDao.getStats()).toHaveLength
    })

    it("Should clean up the leftovers :)", async ()=>{
        expect(await userDao.delUser(testUser)).toBeTruthy();
    })

})

