import express from 'express'
import { AdminRoute } from './admin.route'
const Route = express.Router()
Route.use('/admin', AdminRoute)
export { Route as IndexRoute }