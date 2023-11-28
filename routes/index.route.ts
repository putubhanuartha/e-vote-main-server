import express from 'express'
import { AdminRoute } from './admin.route'
import { WargaRoute } from './warga.route'
import { authenticateUser } from '../middleware/authentication.middleware'
const Route = express.Router()
Route.use('/admin', AdminRoute)
Route.use('/warga', WargaRoute)
Route.use('/check-auth', authenticateUser, (req, res) => {
    res.sendStatus(200)
})
export { Route as IndexRoute }