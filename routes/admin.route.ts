import express, { Request, Response } from 'express'
import AdminController from '../controller/Admin.controller'
import { authenticateUser } from '../middleware/authentication.middleware'
import { authorizeAdmin } from '../middleware/authorization.middleware'
const Route = express.Router()


Route.post('/signup', AdminController.register())
Route.post('/login', AdminController.login())

Route.get("/get-administrative", authenticateUser, authorizeAdmin, AdminController.getAdministrativeData())
Route.post('/create-administrative', authenticateUser, authorizeAdmin, AdminController.createAdministrativeData())

Route.post("/add-warga", authenticateUser, authorizeAdmin, AdminController.addWarga())
Route.get("/show-warga", authenticateUser, authorizeAdmin, AdminController.showWarga())
Route.delete("/delete-warga", authenticateUser, authorizeAdmin, AdminController.deleteWarga())
Route.put("/update-warga", authenticateUser, authorizeAdmin, AdminController.editWarga())


Route.post("/add-voting", authenticateUser, authorizeAdmin, AdminController.addVoting())
Route.get("/available-voting", authenticateUser, authorizeAdmin, AdminController.getAvailableVoting())
Route.put("/update-voting", authenticateUser, authorizeAdmin, AdminController.editVoting())

Route.post('/add-candidate', authenticateUser, authorizeAdmin, AdminController.addCandidate())
Route.get("/get-active-candidates", authenticateUser, authorizeAdmin, AdminController.getActiveCandidate())
Route.delete('/delete-candidate', authenticateUser, authorizeAdmin, AdminController.deleteCandidate())


Route.post('/add-form', authenticateUser, authorizeAdmin, AdminController.addNewForm())
Route.get('/get-forms', authenticateUser, authorizeAdmin, AdminController.getForms())
Route.put('/edit-status-form', authenticateUser, authorizeAdmin, AdminController.editStatusForm())
Route.delete('/delete-form', authenticateUser, authorizeAdmin, AdminController.deleteForm())
Route.put('/edit-form', authenticateUser, authorizeAdmin, AdminController.editForm())
Route.get('/get-form', authenticateUser, authorizeAdmin, AdminController.getForm())

Route.get('/download-form', authenticateUser, authorizeAdmin, AdminController.downloadForm())

Route.use('/check-auth', authenticateUser, authorizeAdmin, (req: Request, res: Response) => {
    res.sendStatus(200)
})

Route.get('/stats-pemilihan', authenticateUser, authorizeAdmin, AdminController.getPemilihan())
Route.get('/get-all-pemilihan', authenticateUser, authorizeAdmin, AdminController.getPemilihanDone())

export { Route as AdminRoute }