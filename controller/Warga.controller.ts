
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
import { StatusFormFilling, StatusVoting } from "../enums";
import { Op } from "sequelize";
import VotingCandidatesModel from "../model/VotingCandidates.model";
import VotingModel from "../model/Voting.model";
import CandidateModel from "../model/Candidate.model";
import AdministrativeModel from "../model/Administrative.model";
import CandidateVotedTransactionModel from "../model/CandidateVotedTransaction.model";
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

    // form
    getAllForms(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { id } = res.locals.decoded
            try {
                const votingTransaction = await CandidateVotedTransactionModel.findAll({ where: { WargaId: id }, include: [{ model: VotingCandidatesModel, attributes: ["fk_votingId"] }] })
                const listIdVoting = votingTransaction.map((el) => el.dataValues.VotingCandidate.dataValues.fk_votingId)
                const votings = await VotingModel.findAll({ where: { status: StatusVoting.active, id: { [Op.notIn]: listIdVoting } }, include: [{ model: AdministrativeModel }] })
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

    // getCandidates
    getCandidates(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { id: votingId } = req.query
            console.log(votingId)
            try {
                const candidates = await VotingCandidatesModel.findAll({ where: { fk_votingId: votingId }, include: [{ model: CandidateModel, include: [{ model: WargaModel }] }, { model: VotingModel, include: [{ model: AdministrativeModel, attributes: ["kecamatan", "kelurahan", "rw", "rt", "jenisPilihan"] }] }] })
                res.status(200).json(candidates)
            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            }

        }
    }

    // choose candidates
    chooseCandidates(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { id } = res.locals.decoded
            const { votingCandidateId } = req.query

            try {
                await CandidateVotedTransactionModel.create({ WargaId: id, VotingCandidateId: votingCandidateId })
                res.sendStatus(200)
            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        }
    }


    getActiveVoting(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            try {
                const candidate = await VotingCandidatesModel.findAll({ include: [{ model: VotingModel, where: { status: StatusVoting.active } }], attributes: ["fk_candidateId"] })
                const candidateMapped = candidate.map((el) => el.dataValues.fk_candidateId)
                console.log(candidateMapped)
                const value = await Promise.all(candidateMapped.map(async (el) => {
                    const data = await CandidateVotedTransactionModel.count({ include: [{ model: VotingCandidatesModel, where: { fk_candidateId: el }, include: [{ model: VotingModel, where: { status: StatusVoting.active } }] }] })
                    const name = await CandidateModel.findOne({ include: [{ model: WargaModel, attributes: ["nama"] }], where: { id: el } })
                    return { label: (name as any).Warga.nama, value: data }
                }))

                res.status(200).json(value)

            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        }
    }
}

export default new WargaController()