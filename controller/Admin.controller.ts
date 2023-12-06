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
import bcrypt from 'bcrypt'
import ExcelJs from 'exceljs'
import fs from 'fs'
import jwt from 'jsonwebtoken'


// sequelize model
import WargaModel from "../model/Warga.model";
import { Op } from "sequelize";
import VotingModel from "../model/Voting.model";
import CandidateModel from "../model/Candidate.model";
import VotingCandidatesModel from "../model/VotingCandidates.model";
import CandidateService from "../service/Candidate.service";
import { StatusVoting } from "../enums";
import AdministrativeModel from "../model/Administrative.model";
import AdministrativeService from "../service/Administrative.service";
import FormService from "../service/Form.service";
import FormContentModel from "../model/FormContentModel";
import FormFilledTransactionModel from "../model/FormFilledTransactionModel";
import { DynamicFormType } from "../types";
import AdminModel from "../model/Admin.model";
import CandidateVotedTransactionModel from "../model/CandidateVotedTransaction.model";


class AdminController extends UserController implements FormService, AdministrativeService, AdminService, WargaService, VotingService, CandidateService {

    login(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { password, username } = req.body
            try {
                const admin = await AdminModel.findOne({ where: { username } })
                if (!admin) {
                    res.sendStatus(404)
                    return
                }
                const encryptPassword = bcrypt.compareSync(password, await admin.getDataValue("password"))
                if (!encryptPassword) {
                    res.sendStatus(401)
                    return
                }
                const token = jwt.sign({ username: await admin.getDataValue("username"), id: await admin.getDataValue("id") }, process.env.JWT_TOKEN as string, { expiresIn: '24h' })
                res.cookie("token", token, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 })
                res.status(200).json(token)
            }
            catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        }
    }
    logout(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {

        }
    }

    register(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { username, password } = req.body
            try {
                const salt = bcrypt.genSaltSync(10)
                const cryptedPass = bcrypt.hashSync(password, salt)
                const admin = await AdminModel.create({ username, password: cryptedPass })
                res.status(200).json(admin)
            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        }
    }

    // administrative
    getAdministrativeData(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const administrativeData = await AdministrativeModel.findOne()
            if (!administrativeData) {
                res.sendStatus(404)
                return
            }
            res.status(200).json(administrativeData)
        }
    }

    createAdministrativeData(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { kecamatan, kelurahan, rw, rt, jenisPilihan } = req.body
            try {
                const wilayah = await AdministrativeModel.create({ kecamatan, kelurahan, rw, ...(rt && { rt }), jenisPilihan })
                res.status(200).json(wilayah)
            } catch (err) {
                console.error(err);
                res.sendStatus(500)
            }
        }
    }

    // warga
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

    // voting
    addVoting(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { date, timeStart, timeEnd, administrativeId } = req.body
            try {
                const responseVoting = await VotingModel.create({ AdministrativeId: administrativeId, epochtimeStart: addTimeAndConvertToEpoch(date, timeStart), epochtimeEnd: addTimeAndConvertToEpoch(date, timeEnd) })
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
                const response = await VotingModel.findOne({ where: { status: { [Op.ne]: "done" } }, include: [{ model: AdministrativeModel }] })
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

    // candidate
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
                const rows = await CandidateModel.count()
                await VotingModel.update({ status: rows > 1 ? StatusVoting.ready : StatusVoting.not_ready }, { where: { id: votingId } })
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
            try {
                const deleted = await CandidateModel.destroy({ where: { id } })
                const rows = await CandidateModel.count()
                if (rows <= 1) await VotingModel.update({ status: StatusVoting.not_ready }, { where: { id: votingId } })
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


    // form
    addNewForm(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { titleForm, contentForm } = req.body
            try {
                const created = await FormContentModel.create({ titleForm, contentForm })
                res.status(200).json(created)
            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        }
    }

    getForms(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            try {
                const responData = await FormContentModel.findAll()
                res.status(200).json(responData)
            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        }
    }
    editStatusForm(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { id } = req.query
            const { status } = req.body
            try {
                const [updated] = await FormContentModel.update({ status }, { where: { id } })
                if (updated > 0) {
                    res.sendStatus(200)
                    return
                }
                res.sendStatus(404)
            } catch (err) {
                console.error(err);
                res.sendStatus(500)
            }
        }
    }
    deleteForm(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { id } = req.query
            try {
                const deletedRows = await FormContentModel.destroy({ where: { id } })
                if (deletedRows > 0) {
                    res.sendStatus(200)
                    return
                }
                res.sendStatus(404)
            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        }
    }
    editForm(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { id } = req.query
            const { titleForm, contentForm } = req.body
            const [updated] = await FormContentModel.update({ titleForm, contentForm }, { where: { id } })
            if (updated <= 0) {
                res.sendStatus(404)
                return
            }
            res.sendStatus(200)
        }
    }
    getForm(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { id } = req.query
            try {
                const response = await FormContentModel.findByPk(id as string)
                if (response) {
                    res.status(200).json(response)
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
    downloadForm(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { id } = req.query
            const headerData = await FormContentModel.findByPk(id as string)
            const data = await FormFilledTransactionModel.findAll({ where: { FormContentId: id }, attributes: ["filledContent"], include: [{ model: WargaModel, attributes: ["nama"] }] })
            const parsedHeaderData = JSON.parse(headerData?.dataValues.contentForm) as DynamicFormType[]
            const parsedData = data.map((el) => {
                const newArr = JSON.parse(el.dataValues.filledContent)
                newArr.push((el as any).Warga.dataValues.nama)
                return newArr
            })

            const workbook = new ExcelJs.Workbook();
            const worksheet = workbook.addWorksheet('Sheet 1')

            const headers = parsedHeaderData.map((el) => el.title)
            headers.push("Nama Warga")
            worksheet.addRow(headers)

            parsedData.forEach((el) => {
                const row: any[] = [];

                el.forEach((val: any) => {
                    if (Array.isArray(val)) {
                        row.push(val.join(', '));
                    } else {
                        row.push(val);
                    }
                })

                worksheet.addRow(row)

            })

            const tempFilePath = `${headerData?.dataValues.titleForm}.xlsx`;
            workbook.xlsx.writeFile(tempFilePath)
                .then(() => {
                    // Set headers for file download
                    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
                    res.setHeader('Content-Disposition', `attachment; filename=${headerData?.dataValues.titleForm}.xlsx`);
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                    // Send the file to the client
                    const fileStream = fs.createReadStream(tempFilePath).pipe(res);
                    fileStream.on('close', () => {
                        fs.unlink(tempFilePath, (err) => {
                            if (err) {
                                console.error('Error deleting file:', err);
                            } else {
                                console.log('File deleted successfully.');
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('Error creating Excel file:', error);
                    res.status(500).send('Internal Server Error');
                });

        }
    }

    getPemilihan(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            const { votingId } = req.query
            try {

                const candidate = await VotingCandidatesModel.findAll({ where: { fk_votingId: votingId }, include: [{ model: VotingModel }], attributes: ["fk_candidateId"] })
                const candidateMapped = candidate.map((el) => el.dataValues.fk_candidateId)
                console.log(candidateMapped)
                const value = await Promise.all(candidateMapped.map(async (el) => {
                    const data = await CandidateVotedTransactionModel.count({ include: [{ model: VotingCandidatesModel, where: { fk_candidateId: el, fk_votingId: votingId } }] })
                    const name = await CandidateModel.findOne({ include: [{ model: WargaModel, attributes: ["nama"] }], where: { id: el } })
                    return { label: (name as any).Warga.nama, value: data }
                }))

                res.status(200).json(value)
            } catch (err) {
                console.error(err);
                res.sendStatus(500)
            }
        }
    }

    getPemilihanDone(): (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void> {
        return async (req, res) => {
            try {
                const data = await VotingModel.findAll({ where: { status: StatusVoting.done } })
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