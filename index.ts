import express from 'express';
import { UserDao } from './daos/user-dao';
import { UserDaoImpl } from './daos/user-dao-impl';
import { addRequest, Reimb, User } from './entities';
import { UserServiceImpl } from './services/user-service-impl';
import { UserService } from './services/user-service';
import { ReimbDao } from './daos/reimb-dao';
import { ReimbDaoImpl } from './daos/reimb-dao-impl';
import { ReimbService } from './services/reimb-service';
import { ReimbServiceImpl } from './services/reimb-service-impl';
import { CosmosClient } from '@azure/cosmos';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const userDao:UserDao = new UserDaoImpl();
const userSvc:UserService = new UserServiceImpl(userDao);//dependency injection
const reimbDao:ReimbDao = new ReimbDaoImpl();
const reimbSvc:ReimbService = new ReimbServiceImpl(reimbDao);//

//post a user
app.post("/users", async (req,res)=>{
    const user:User = req.body;
    const returnedUser:User = await userSvc.svcAddUser(user);
    res.status(201);
    res.send(returnedUser);
})
//get user by id
app.get("/users/:id", async (req,res) =>{
    const returnedUser = await userSvc.getUserByID(req.params.id);
    try{
        res.send(200);
        res.send(returnedUser)
    } catch(error) {console.error("problem sending status/header in user by id")}
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
//add reimb to user
app.patch("/users/reimbs", async (req,res) =>{
    //make sure the user fragment has all its information
    const users:User[] = await userSvc.svcGetAllUsers();
    const reimbs:Reimb[] = await reimbSvc.svcGetAllReimbs();
    const request:addRequest = req.body;
    let user = await userSvc.getUserByID(request.user.id)
    const reimb = request.reimb;
    //update
    const returnedUser = await userSvc.svcAddReimbToUser(user,reimb);
    res.status(202);
    res.send(user);
})
//USER/LOGIN STUFF?
app.patch("/login", async(req,res) =>{
    const user:User = req.body;
    const returnedUser:User = await userSvc.svcLogin(user);
    res.status(200)
    res.send(returnedUser);
})
//duplicate login? unnecessary?
//USER/LOGIN STUFF?
app.patch("", async(req,res) =>{
    const user:User = req.body;
    const returnedUser:User = await userSvc.svcLogin(user);
    res.status(200)
    res.send(returnedUser);
})
app.get("/stats", async (req,res) =>{
    const response = await userSvc.getStats();
    res.status(200);
    res.send(response);
})

//REIMBURSEMENTS
//post a reimbursement
app.post("/reimbs", async (req,res)=>{
    //make sure user has all its info
    const users:User[] = await userSvc.svcGetAllUsers();
    const request:addRequest = req.body;
    let user = users.find(u => u.username === request.user.username)
    //get reimb too
    let reimb = request.reimb;
    //create reimb, then add it
    reimb = await reimbSvc.svcAddReimb(reimb);
    user = await userSvc.svcAddReimbToUser(user,reimb);
    res.status(201);
    res.send(reimb);
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
    const returnedReimb:Reimb = await reimbSvc.svcApprove(reimb);
    res.status(201);
    res.send(returnedReimb);
})
//deny a reimbursement
app.patch("/reimbs/deny", async (req,res) =>{
    const reimb:Reimb = req.body;
    const returnedReimb:Reimb = await reimbSvc.svcDeny(reimb);
    res.status(201);
    res.send(returnedReimb);
})


app.listen(8080,()=>console.log("well, it ran"))