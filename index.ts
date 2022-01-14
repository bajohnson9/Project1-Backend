import express from 'express';
import { UserDao } from './daos/user-dao';
import { UserDaoImpl } from './daos/user-dao-impl';
import { Reimb, User } from './entities';
import { UserServiceImpl } from './services/user-service-impl';
import { UserService } from './services/user-service';
import { ReimbDao } from './daos/reimb-dao';
import { ReimbDaoImpl } from './daos/reimb-dao-impl';
import { ReimbService } from './services/reimb-service';
import { ReimbServiceImpl } from './services/reimb-service-impl';
import cors from 'cors';
import { LoginService } from './services/login-service';
import { LoginServiceImpl } from './services/login-service-impl';

const app = express();
app.use(express.json());
app.use(cors());

const userDao:UserDao = new UserDaoImpl();
const userSvc:UserService = new UserServiceImpl(userDao);//dependency injection
const reimbDao:ReimbDao = new ReimbDaoImpl();
const reimbSvc:ReimbService = new ReimbServiceImpl(reimbDao);//dependency injection
const loginSvc:LoginService = new LoginServiceImpl(userDao);//

//USER/LOGIN STUFF?
app.get("/login", async(req,res) =>{
    const user:User = req.body;
    const returnedUser:User = await loginSvc.svcLogin(user);
})
//post a user
app.post("/users", async (req,res)=>{
    const user:User = req.body;
    const returnedUser:User = await userSvc.svcAddUser(user);
    res.status(201);
    res.send(returnedUser);
})
//get all users
app.get("/users", async (req,res) =>{
    const users:User[] = await userSvc.svcGetAllUsers();
    res.status(200);
    res.send(users);
})
//delete user
app.delete("/users", async (req,res) =>{
    const user:User = req.body;
    const users:User[] = await userSvc.svcDelUser(user);
    res.status(202);
    res.send(users);
})

//REIMBURSEMENTS
//post a reimbursement
app.post("/reimbs", async (req,res)=>{
    const reimb:Reimb = req.body;
    const returnedReimb:Reimb = await reimbSvc.svcAddReimb(reimb);
    res.status(201);
    res.send(returnedReimb);
})
//get all reimbursements
app.get("/reimbs", async (req,res) =>{
    const reimbs:Reimb[] = await reimbSvc.svcGetAllReimbs();
    res.status(200);
    res.send(reimbs);
})
//delete a reimbursement
app.delete("/reimbs", async (req,res) =>{
    const reimb:Reimb = req.body;
    const reimbs:Reimb[] = await reimbSvc.svcDelReimb(reimb);
    res.status(202);
    res.send(reimbs);
})
//approve a reimbursement
app.patch("/reimbs/approve", async (req,res) =>{
    const reimb:Reimb = req.body;
    const reimbs:Reimb[] = await reimbSvc.svcApprove(reimb);
    res.status(201);
    res.send(reimbs);
})
//deny a reimbursement
app.patch("/reimbs/deny", async (req,res) =>{
    const reimb:Reimb = req.body;
    const reimbs:Reimb[] = await reimbSvc.svcDeny(reimb);
    res.status(201);
    res.send(reimbs);
})


app.listen(5000,()=>console.log("well, it ran"))