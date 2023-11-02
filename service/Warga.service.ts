import { Request, Response } from "express"
interface WargaService {
    editWarga(): (req: Request, res: Response) => Promise<void>
}

export default WargaService