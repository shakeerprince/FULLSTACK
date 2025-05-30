import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from "./utils/db.js"
import cookieParser from "cookie-parser"

//router import
import userRouters from './routes/user.routes.js'


dotenv.config();


const app =  express();

app.use(
    cors({
        origin: process.env.BASE_URL,
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());


const port = process.env.PORT || 4000;

app.get('/', (req, res )=>{
 res.send('Hello')
})

app.get('/shaker', (req, res)=>{
    res.send('Hello shaker')
})

//connect to db 
db()

//user routes
app.use("/api/v1/users", userRouters);

app.listen(port, () => {
    console.log(`Server listening on the port ${port}`);
}); 