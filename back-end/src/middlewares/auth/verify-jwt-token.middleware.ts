import { NextFunction, Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from "jsonwebtoken"
import { ENV } from '../../config/env'
import { CustomerOrEmployee } from '../../types/customer-or-employee.type'

interface TokenPayload extends jwt.JwtPayload, CustomerOrEmployee {

}

const verifyJwtTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers?.authorization

        if (!authorizationHeader) {
            res.status(StatusCodes.UNAUTHORIZED).send('Access Denied!');
            return;
        }

        const token = ((authorizationHeader?.split(' ')) != null) ? authorizationHeader?.split(' ')[1] : null

        if (!token) {
            res.status(StatusCodes.UNAUTHORIZED).send('Access Denied!');
            return;
        }

        const decodedToken = jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;

        req.user = decodedToken;
        next();
    } catch (error: any) {
        console.error(`Error trying to verify jwt token.\nReason: ${error?.message}`)
        res.status(StatusCodes.UNAUTHORIZED).send("Access Denied!");
    }
}

export { verifyJwtTokenMiddleware, TokenPayload }
