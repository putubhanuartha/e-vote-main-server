import UserController from "./User.controller";
import AdminService from "../service/Admin.service";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import WargaService from "../service/Warga.service";
import tokenGenerator from "../helper/tokenGenerator.helper";
import emailSender from "../helper/emailSender.helper";
import VotingService from "../service/Voting.service";
import { addTimeAndConvertToEpoch } from "../helper/timeConverter";


// sequelize model
import WargaModel from "../model/Warga.model";
import { Op } from "sequelize";
import VotingModel from "../model/Voting.model";
import CandidateModel from "../model/Candidate.model";
import VotingCandidatesModel from "../model/VotingCandidates.model";
import CandidateService from "../service/Candidate.service";
import { StatusVoting } from "../enums";


class AdminController extends UserController implements AdminService, WargaService, VotingService, CandidateService {

    login(): void {

    }

    logout(): void {

    }

    addWarga(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { nama, nik, email } = req.body
            try {
                let token: string = tokenGenerator()
                let activeToken = await WargaModel.findOne({ where: { nik, registered: Boolean(0), token } })
                while (activeToken) {
                    token = tokenGenerator()
                    activeToken = await WargaModel.findOne({ where: { nik, registered: Boolean(0), token } })
                }

                const warga = await WargaModel.create({ nama, email, nik, token })
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
                const deleted = await WargaModel.destroy({ where: { id: id } })
                if (deleted > 0) {
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
                const [updatedUser] = await WargaModel.update({ nama, nik, email }, { where: { id } })
                if (updatedUser > 0) {
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
                const data = await WargaModel.findAll({ where: { ...(keyword && { [Op.or]: [{ nama: { [Op.like]: `%${keyword}%` } }, { nik: { [Op.like]: `%${keyword}%` } }] }) } })
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
                const responseVoting = await VotingModel.create({ kecamatan, kelurahan, rw: Number(rw), rt: Number(rt), jenisPilihan, epochtimeStart: addTimeAndConvertToEpoch(date, timeStart), epochtimeEnd: addTimeAndConvertToEpoch(date, timeEnd) })
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
            console.log(rt)
            try {
                const [updatedResponse] = await VotingModel.update({ kecamatan: kecamatan, kelurahan: kelurahan, rw: Number(rw), epochtimeEnd: addTimeAndConvertToEpoch(date, timeEnd), epochtimeStart: addTimeAndConvertToEpoch(date, timeStart), jenisPilihan: jenisPilihan, rt: Number(rt) }, { where: { id } })
                if (updatedResponse === 0) {
                    res.sendStatus(500)
                    return
                }
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
                const response = await VotingModel.findOne({ where: { status: { [Op.ne]: "done" } } })
                if (!response) {
                    res.sendStatus(404)
                    return
                }
                res.status(200).json(response)
            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            }

        }
    }

    getActiveCandidate(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { votingId } = req.query
            try {
                const activeCandidate = await VotingCandidatesModel.findAll({ where: { fk_votingId: votingId }, include: [{ model: CandidateModel, include: [{ model: WargaModel, attributes: ["nama", "nik", "email"] }] }] })
                res.status(200).json(activeCandidate)
            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            }

        }
    }
    addCandidate(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { visi, misi, imageUrl, kandidat, votingId } = req.body
            try {
                const candidate = await CandidateModel.create({ visi, misi, photoUrl: imageUrl, WargaId: kandidat })
                const response = await VotingCandidatesModel.create({ fk_votingId: votingId, fk_candidateId: candidate.dataValues.id })
                await VotingModel.update({ status: StatusVoting.ready }, { where: { id: votingId } })
                res.status(200).json({ ...candidate.dataValues, ...response.dataValues })
            }
            catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        }
    }

    deleteCandidate(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { id, votingId } = req.query
            console.log(id)
            try {
                const deleted = await CandidateModel.destroy({ where: { id } })
                const rows = await CandidateModel.count()
                if (rows === 0) await VotingModel.update({ status: StatusVoting.not_ready }, { where: { id: votingId } })
                if (deleted > 0) {
                    res.sendStatus(200)
                    return
                }
                res.sendStatus(404)
            }
            catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        }
    }

}

export default new AdminController()