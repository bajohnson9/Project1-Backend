# Project 1 Backend
- A Node project implementing Express to host and modify a Cosmos database
- Database includes Users (employee/manager) and Reimbursements (type/desc/amount/approval status)

## For use with Project 1 Frontend

## Includes the following fetch requests:

- POST /users
	- Post a user
- GET /users
	- Get all users
- GET /users/:id
	- Get a user by ID 
- DELETE /users
	- Delete a user
- PATCH /users/reimbs
	- Add a reimbursement to a user's collection
- PATCH / and PATCH /login
	- User authentication
- GET /stats
	- Retrieve statistics
- POST /reimbs
	- Post a reimbursement
- GET /reimbs
	- Get all reimbursements
- DELETE /reimbs
	- Delete a reimbursement
- PATCH /reimbs/approve
	- Approve a reimbursement
- PATCH /reimbs/deny
	- Deny a reimbursement

	