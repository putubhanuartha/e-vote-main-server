import { Request, Response } from "express"
interface CandidateService {
    addCandidate(): (req: Request, res: Response) => Promise<void>
    getActiveCandidate(): (req: Request, res: Response) => Promise<void>
    deleteCandidate(): (req: Request, res: Response) => Promise<void>
}

export default CandidateService