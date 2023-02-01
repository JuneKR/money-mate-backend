import { config } from 'dotenv';
import express, { Application, NextFunction, Express, Request, Response } from 'express';

config();

const app: Application = express();

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello, World!')
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})