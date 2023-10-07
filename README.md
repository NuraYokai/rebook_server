# rebook_server
NuraYokai/rebook_server (github.com)
This is the backend server using express.js for a Book Recommendation Web App. But this server can be used for any signup and signin process.
In this server i have created two routes, signup and signin.
The database for this server is mysql.
The main logic for the signup is in the api/signup and for signin api/signin.
In signup i have used simple if statements to check if the api request body is empty or not, 
then a simple email regex is being tested, then length of the password is checked, 
the next is to check if the user with the email exist in the database, 
if not exist then the password hash is created using bcrypt and finally the email and 
the hash of the password is inserted into the database and a success status is returned when all the above validation have been done.
The code for signin is almost the same as the signup but with some few tweaks like, 
when the user exists in the database it generates a JWT token for user authentication and that token is stored in the database and is returned in the response body.
In config/db.js I am using the db connection pool to keep open a single connection for accessing the database.
In models/userModel, I have created a const called "checkTableQuery" to query for table "users" count.
Then using the connection pool i opened in the config/db i am getting the result for "checkTableQuery". 
If the result is greater than 0 then it just prints the "Table 'users' exists, server is ready". 
If the result is 0 then a created table query is executed which created the table.
The above is just a simple explanation of how the server works.

config/db.js :- database connection is created.
models/userModel.js :- user table is created.
api/signup :- signup logic.
api/signin :- signin logic.
index.js :- setting up routes and starting the server.
