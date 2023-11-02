import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { PrismaClient } from '@prisma/client';
import mail from '@sendgrid/mail';
import { IndexRoute } from './routes/index.route';

dotenv.config();
const sg_api_key = process.env.SENDGRID_API_KEY as string
const prisma = new PrismaClient()
const app: Express = express();
const port = process.env.SERVER_PORT;

async function main() {
    app.use(cors({ origin: [process.env.ADMIN_CLIENT_URL as string], credentials: true }))
    mail.setApiKey(sg_api_key)
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(IndexRoute)
    app.get('/', async (req: Request, res: Response) => {
        const data = await prisma.candidate.findMany()
        res.status(200).json(data);
    });

    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })