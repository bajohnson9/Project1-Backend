import express from 'express';
import { UserDao } from './daos/user-dao';
import { UserDaoImpl } from './daos/user-dao-impl';
import { User } from './entities';
import { UserServiceImpl } from './services/book-service-impl';
import { UserService } from './services/user-service';


const app = express();
app.use(express.json());

const userDao:UserDao = new UserDaoImpl();
const userSvc:UserService = new UserServiceImpl(userDao);//dependency injection

//post a user
app.post("/login", async (req,res)=>{
    const user:User = req.body;
    const returnedUser:User = await userSvc.svcAddUser(user);
    res.status(201);
    res.send(returnedUser);
})

//get all users
app.get("/login", async (req,res) =>{
    const users:User[] = await userSvc.svcGetAllUsers();
    res.status(200);
    res.send(users);
})

app.listen(5000,()=>console.log("well, it ran"))