import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config()
const DB_URL_HOST = process.env.DB_URL_HOST
const DB_PORT = process.env.DB_PORT
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME
const sequelize = new Sequelize(DB_NAME as string, DB_USERNAME as string, DB_PASSWORD, {
    host: DB_URL_HOST,
    dialect: "mysql",
    port: Number(DB_PORT)
});

export default sequelize