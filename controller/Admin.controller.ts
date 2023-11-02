import { Prisma } from "@prisma/client";
import UserController from "./User.controller";
import { DefaultArgs } from "@prisma/client/runtime/library";
import AdminService from "../service/Admin.service";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import WargaService from "../service/Warga.service";
import tokenGenerator from "../helper/tokenGenerator";
import emailSender from "../helper/emailSender";


class AdminController extends UserController implements AdminService, WargaService {
    modelAdmin: Prisma.AdminDelegate<DefaultArgs>
    modelWarga: Prisma.WargaDelegate<DefaultArgs>
    constructor() {
        super()
        this.modelAdmin = this.prismaClient.admin
        this.modelWarga = this.prismaClient.warga
    }

    login(): void {

    }

    logout(): void {

    }
    addWarga(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { nama, nik, email } = req.body
            try {
                let token: string = tokenGenerator()
                let activeToken = await this.modelWarga.findUnique({ where: { nik, registered: Boolean(0), token } })
                while (activeToken) {
                    token = tokenGenerator()
                    activeToken = await this.modelWarga.findUnique({ where: { nik, registered: Boolean(0), token } })
                }

                const warga = await this.modelWarga.create({
                    data: {
                        email, nik, nama, token
                    }
                })
                await emailSender(`<h1>Halo, ${nama}</h1><br><p>Berikut adalah token anda untuk registrasi pada aplikasi E-Vote</p><br><p>Token : ${token}<p/>`, [email], 'Registration Token')
                res.status(200).json(warga)

            } catch (err) {
                console.error(err)
                res.status(500).json({ message: "Error creating row, data may duplicate" })
            }
        }
    }
    deleteWarga(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {

        }
    }
    editWarga(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {

        }
    }

    showWarga(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { keyword } = req.query
            try {
                let data;
                if(keyword) {
                    data = await this.modelWarga.findMany({ where: { OR: [{ nama: { contains: keyword as string | undefined } }, { nik: { contains: keyword as string | undefined } }] } })
                }else{
                    data = await this.modelWarga.findMany({ select: { email: true, id: true, nama: true, nik: true, registered: true } })
                }
                res.status(200).json(data)
            }
            catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        }
    }
 

}

export default new AdminController()