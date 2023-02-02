import { config } from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import session from "express-session";
import SequelizeStore from 'connect-session-sequelize';
import db from './config/Database';

/* Routes */
import UserRoute from "./routes/UserRoute";

config();

const app: Application = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

/* Run MySQL Code! */ 
// (async ()=> {
//     await db.sync();
// })();

const SECRET = process.env.SESS_SECRET

if(!SECRET) {
    throw new Error('Messing Session Secret!')
}

app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}))

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))

// app.get('/', (req: Request, res: Response, next: NextFunction) => {
//     res.send('Hello, World!')
// })

app.use(express.json());
app.use(UserRoute);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})