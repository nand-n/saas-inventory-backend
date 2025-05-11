import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RolesGuardService implements NestMiddleware {
    
    use(req: Request, res: Response, next: NextFunction) {

        if (req.user && req.user === 'player') {
            next(); 
        } else {
            throw new UnauthorizedException('Unauthorized access');
        }
    }
}
