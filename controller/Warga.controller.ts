
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import UserController from "./User.controller";
import bcrypt from 'bcrypt'
import WargaModel from "../model/Warga.model";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import FormFilledTransactionModel from "../model/FormFilledTransactionModel";
import FormContentModel from "../model/FormContentModel";
import { StatusFormFilling } from "../enums";
import { Op } from "sequelize";
dotenv.config()

const SECRET_TOKEN = process.env.JWT_TOKEN;

class WargaController extends UserController {
    constructor() {
        super()
    }
    login(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { password, nik } = req.body
            const warga = await WargaModel.findOne({ where: { nik, registered: true } })
            if (!warga) {
                res.sendStatus(404);
                return;
            }
            const isAuth = bcrypt.compareSync(password, await warga.getDataValue("password"))
            if (!isAuth) {
                res.sendStatus(401)
                return
            }
            const token = jwt.sign({ nik: await warga.getDataValue("nik"), id: await warga.getDataValue("id"), nama: await warga.getDataValue("nama") }, SECRET_TOKEN as string, { expiresIn: '12h' })
            res.cookie("token", token, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 })
            res.status(200).json(token)
        }
    }
    logout(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {

        }
    }
    register(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const salt = bcrypt.genSaltSync()
            const { nik, token, password } = req.body
            try {
                const warga = await WargaModel.findOne({ where: { nik, token } })
                if (!warga) {
                    res.sendStatus(404)
                    return
                }
                const cryptPassword = bcrypt.hashSync(password, salt);
                await WargaModel.update({ password: cryptPassword, registered: true, token: null }, { where: { nik } })
                res.sendStatus(200)
            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        }
    }

    getAllForms(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { id } = res.locals.decoded
            try {
                const votings: any = []
                const listId = await FormFilledTransactionModel.findAll({ where: { WargaId: id }, attributes: ["FormContentId"] })
                const idsForm = listId.map((el) => el.getDataValue("FormContentId"))
                const data = await FormContentModel.findAll({ where: { status: StatusFormFilling.active, id: { [Op.notIn]: idsForm } } })
                res.status(200).json({ votings: votings, forms: data })
            } catch (err) {
                res.sendStatus(500)
            }

        }
    }
    getForm(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { id: formId } = req.query
            try {
                const data = await FormContentModel.findByPk(formId as string)
                res.status(200).json(data)
            } catch (err) {
                res.sendStatus(500)
            }

        }
    }

    postAnswerForm(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { id: userId } = res.locals.decoded
            const { id: idForm } = req.query
            const { data } = req.body
            try {
                const dataRes = await FormFilledTransactionModel.create({ FormContentId: idForm, filledContent: data, WargaId: userId })
                res.status(200).json(dataRes)
            } catch (err) {
                res.sendStatus(500)
            }

        }
    }


}

export default new WargaController()