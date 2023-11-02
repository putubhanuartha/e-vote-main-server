import { Request, Response } from "express"
interface AdminService {
    addWarga(): (req: Request, res: Response) => Promise<void>
    deleteWarga(): (req: Request, res: Response) => Promise<void>
    showWarga(): (req: Request, res: Response) => Promise<void>
}

export default AdminService