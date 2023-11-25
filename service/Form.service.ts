import { Request, Response } from "express"
interface FormService {
    addNewForm(): (req: Request, res: Response) => Promise<void>
    getForms(): (req: Request, res: Response) => Promise<void>
    editStatusForm(): (req: Request, res: Response) => Promise<void>
    deleteForm(): (req: Request, res: Response) => Promise<void>
    editForm(): (req: Request, res: Response) => Promise<void>
    getForm(): (req: Request, res: Response) => Promise<void>
}

export default FormService