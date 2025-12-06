import jwt, { JwtPayload }  from 'jsonwebtoken';

import { NextFunction, Request, Response } from "express"
import config from '../config';

const auth= (...roles: string[]) =>{
    return async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const authToken = req.headers.authorization;
        
        if(!authToken){
            return res.status(401).json({
                message: "Authorization missing, You are not allowed !"
            })
        }
        console.log("authToken:", authToken);
        const token = authToken.split(" ")[1];
        
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token missing"
            })
        }
        
        const decoded = jwt.verify(token, config.jwtSecret as string)as JwtPayload;
        console.log({decoded});
        req.user = decoded ;

        if(roles.length && !roles.includes(decoded.role as string)){
            return res.status(500).json({
              error: "Unauthorized !!"  
            })
        }
        next();

        } catch (error :any) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    
}
export default auth;