import { NextFunction, Request, Response } from "express";
import WargaModel from "../model/Warga.model";
import AdminModel from "../model/Admin.model";

export const authorizeWarga = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = res.locals.decoded
    try {
        const warga = await WargaModel.findByPk(id)
        if (!warga) return res.sendStatus(401)
    } catch (err) {
        return res.sendStatus(500)
    }
    next()
}

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = res.locals.decoded
    try {
        const admin = await AdminModel.findByPk(id)
        if (!admin) return res.sendStatus(401)
    } catch (err) {
        return res.sendStatus(500)
    }
    next()
}