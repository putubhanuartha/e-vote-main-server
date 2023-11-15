import express from 'express'
import AdminController from '../controller/Admin.controller'
const Route = express.Router()
Route.post("/add-warga", AdminController.addWarga())
Route.get('/show-warga', AdminController.showWarga())
Route.delete('/delete-warga', AdminController.deleteWarga())
export { Route as AdminRoute }