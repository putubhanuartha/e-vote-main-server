import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import mail from '@sendgrid/mail';
import { IndexRoute } from './routes/index.route';
import sequelize from './config/database';

dotenv.config();
const sg_api_key = process.env.SENDGRID_API_KEY as string
const app: Express = express();
const port = process.env.SERVER_PORT;

async function main() {
    app.use(cors({ origin: [process.env.ADMIN_CLIENT_URL as string], credentials: true }))
    mail.setApiKey(sg_api_key)
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(IndexRoute)

    try {
        await sequelize.authenticate()
        console.log("database is authenticated ...")
        await sequelize.sync()
        console.log("database is sync ...")
        app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
        });
    }
    catch (err) {
        console.error(err)
    }

}

main()