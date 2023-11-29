import { Request, Response } from "express"
interface AdministrativeService {
    getAdministrativeData(): (req: Request, res: Response) => Promise<void>
    createAdministrativeData(): (req: Request, res: Response) => Promise<void>
}

export default AdministrativeService