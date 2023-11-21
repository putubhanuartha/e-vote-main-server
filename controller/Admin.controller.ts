import { Prisma, Voting } from "@prisma/client";
import UserController from "./User.controller";
import { DefaultArgs } from "@prisma/client/runtime/library";
import AdminService from "../service/Admin.service";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import WargaService from "../service/Warga.service";
import tokenGenerator from "../helper/tokenGenerator.helper";
import emailSender from "../helper/emailSender.helper";
import VotingService from "../service/Voting.service";
import { addTimeAndConvertToEpoch } from "../helper/timeConverter";


class AdminController extends UserController implements AdminService, WargaService, VotingService {
    modelAdmin: Prisma.AdminDelegate<DefaultArgs>
    modelWarga: Prisma.WargaDelegate<DefaultArgs>
    modelVote: Prisma.VotingDelegate<DefaultArgs>
    modelVotingCandidates: Prisma.VotingCandidatesDelegate<DefaultArgs>
    constructor() {
        super()
        this.modelAdmin = this.prismaClient.admin
        this.modelWarga = this.prismaClient.warga
        this.modelVote = this.prismaClient.voting
        this.modelVotingCandidates = this.prismaClient.votingCandidates
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
            const { id } = req.query
            try {
                const deleted = await this.modelWarga.delete({ where: { id: id as string } })
                if (deleted) {
                    res.status(200).json(deleted)
                    return
                }
                res.status(404).json({ message: "data not found" })
            }
            catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        }
    }
    editWarga(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { id } = req.query
            const { nama, nik, email } = req.body
            try {
                const updatedUser = await this.prismaClient.warga.update({
                    where: { id: id as string }, data: {
                        nama, nik, email
                    }
                })
                if (updatedUser) {
                    res.status(200).json(updatedUser)
                    return
                }
                res.status(404).json({ message: "data not found" })
            }
            catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        }
    }

    showWarga(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { keyword } = req.query
            try {
                let data;
                if (keyword) {
                    data = await this.modelWarga.findMany({ where: { OR: [{ nama: { contains: keyword as string | undefined } }, { nik: { contains: keyword as string | undefined } }] } })
                } else {
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

    addVoting(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { date, timeStart, timeEnd, jenisPilihan, kelurahan, kecamatan, rt, rw } = req.body
            try {
                const responseVoting = await this.modelVote.create({ data: { kecamatan: kecamatan, kelurahan: kelurahan, rw: Number(rw), epochtimeEnd: addTimeAndConvertToEpoch(date, timeEnd), epochtimeStart: addTimeAndConvertToEpoch(date, timeStart), jenisPilihan: jenisPilihan, rt: Number(rt) } })
                res.status(200).json(responseVoting)
            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            }

        }
    }

    editVoting(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { id } = req.query
            const { date, timeStart, timeEnd, jenisPilihan, kelurahan, kecamatan, rt, rw } = req.body
            try {
                const updatedResponse = await this.modelVote.update({ where: { id: id as string }, data: { kecamatan: kecamatan, kelurahan: kelurahan, rw: Number(rw), epochtimeEnd: addTimeAndConvertToEpoch(date, timeEnd), epochtimeStart: addTimeAndConvertToEpoch(date, timeStart), jenisPilihan: jenisPilihan, rt: Number(rt) } })
                res.status(200).json(updatedResponse)
            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        }
    }

    getAvailableVoting(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            try {
                const response = await this.modelVote.findFirst({ where: { status: { not: "done" } } })
                if (!response) {
                    res.sendStatus(500)
                    return
                }
                res.status(200).json(response)
            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            }

        }
    }

}

export default new AdminController()