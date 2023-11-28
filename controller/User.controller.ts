
import { Request, Response } from "express"
abstract class UserController {
    abstract login(): (req: Request, res: Response) => Promise<void>;
    abstract logout(): (req: Request, res: Response) => Promise<void>
}

export default UserController