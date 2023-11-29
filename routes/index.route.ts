import express from 'express'
import { AdminRoute } from './admin.route'
import { WargaRoute } from './warga.route'
const Route = express.Router()
Route.use('/admin', AdminRoute)
Route.use('/warga', WargaRoute)

export { Route as IndexRoute }