import express from 'express'
const Router = express.Router()
import WargaController from '../controller/Warga.controller'
import { authenticateUser } from '../middleware/authentication.middleware'
import { authorizeWarga } from '../middleware/authorization.middleware'

Router.post('/signup', WargaController.register())
Router.post('/login', WargaController.login())

Router.get('/get-forms', authenticateUser, authorizeWarga, WargaController.getAllForms())
Router.get('/get-form', authenticateUser, authorizeWarga, WargaController.getForm())
Router.post('/answer-form', authenticateUser, authorizeWarga, WargaController.postAnswerForm())

export { Router as WargaRoute }