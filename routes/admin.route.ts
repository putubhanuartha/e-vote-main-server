import express from 'express'
import AdminController from '../controller/Admin.controller'
const Route = express.Router()
Route.post("/add-warga", AdminController.addWarga())
Route.get("/show-warga", AdminController.showWarga())
Route.delete("/delete-warga", AdminController.deleteWarga())
Route.put("/update-warga", AdminController.editWarga())


Route.post("/add-voting", AdminController.addVoting())
Route.get("/available-voting", AdminController.getAvailableVoting())
Route.put("/update-voting", AdminController.editVoting())

export { Route as AdminRoute }