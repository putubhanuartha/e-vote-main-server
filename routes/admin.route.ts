import express from 'express'
import AdminController from '../controller/Admin.controller'
const Route = express.Router()

Route.get("/get-administrative", AdminController.getAdministrativeData())

Route.post("/add-warga", AdminController.addWarga())
Route.get("/show-warga", AdminController.showWarga())
Route.delete("/delete-warga", AdminController.deleteWarga())
Route.put("/update-warga", AdminController.editWarga())


Route.post("/add-voting", AdminController.addVoting())
Route.get("/available-voting", AdminController.getAvailableVoting())
Route.put("/update-voting", AdminController.editVoting())

Route.post('/add-candidate', AdminController.addCandidate())
Route.get("/get-active-candidates", AdminController.getActiveCandidate())
Route.delete('/delete-candidate', AdminController.deleteCandidate())


Route.post('/add-form', AdminController.addNewForm())
Route.get('/get-forms', AdminController.getForms())
Route.put('/edit-status-form', AdminController.editStatusForm())
Route.delete('/delete-form', AdminController.deleteForm())
Route.put('/edit-form', AdminController.editForm())
Route.get('/get-form', AdminController.getForm())

Route.get('/download-form', AdminController.downloadForm())

export { Route as AdminRoute }