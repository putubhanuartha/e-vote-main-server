import { Request, Response } from "express"
interface VotingService {
    addVoting(): (req: Request, res: Response) => Promise<void>
    editVoting(): (req: Request, res: Response) => Promise<void>
    getAvailableVoting(): (req: Request, res: Response) => Promise<void>
}

export default VotingService