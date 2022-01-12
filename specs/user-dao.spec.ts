import { UserDao } from "../daos/user-dao";
import { UserDaoImpl } from "../daos/user-dao-impl";
import { User } from "../entities";

describe("User get test", ()=>{
    const userDao: UserDao = new UserDaoImpl;
    let testUser: User = 
    {username:'testmanager',password:'password',id:'',isAuthenticated:true,isManager:true,reimbs:['001','002']}

    
    

    it("Should create a User", async ()=>{
        const returnedUser: User = await userDao.createUser(testUser);
        expect(returnedUser.id).toBeTruthy();
        //redundant comment vv
        //to use in later tests vvv AKA redundant
        testUser = returnedUser;

    })

    it("Should return all users", async ()=>{
        const l = await userDao.getAllUsers.length;
        //need to import as an array (or is it an object with a name or is it the bgael)
        const user1:User = {username:'testmgr',password:'password',id:'',isAuthenticated:true,isManager:true,reimbs:['001']}
        const user2:User = {username:'testemp',password:'password',id:'',isAuthenticated:true,isManager:false,reimbs:['002','003']}
        //test without reimbs/other vars                      ---------------                       test without reimbs/other vars
        const user3:User = {username:'testhacker',password:'password',id:'',isAuthenticated:false,isManager:false,reimbs:[]}
        await userDao.createUser(user1)
        await userDao.createUser(user2)
        await userDao.createUser(user3)

        const returnedUsers: User[] = await userDao.getAllUsers();
        //probably change the 3 here                 v
        expect(returnedUsers.length).toBe(l + 3);
        
        
    })

    it("Should delete a User", async ()=>{

        //need to delete all their reimbs too
        const l = await userDao.getAllUsers.length;
        await userDao.delUser({username:'testmgr',password:'password',id:'',isAuthenticated:true,isManager:true,reimbs:['001']})
        await userDao.delUser({username:'testemp',password:'password',id:'',isAuthenticated:true,isManager:true,reimbs:['001']})
        await userDao.delUser({username:'testhacker',password:'password',id:'',isAuthenticated:true,isManager:true,reimbs:['001']})
        
        expect(l === (await userDao.getAllUsers.length - 3));

    })
    
})

