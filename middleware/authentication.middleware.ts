import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
const SECRET_TOKEN = process.env.JWT_TOKEN
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies
    if (!token) return res.sendStatus(401)
    jwt.verify(token, SECRET_TOKEN as string, function (err: any, decoded: any) {
        if (err) {
            return res.sendStatus(403)
        }
        console.log(decoded)
        res.locals.decoded = decoded
        next()
    });
}