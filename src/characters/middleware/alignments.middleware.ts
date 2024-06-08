import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AlignmentsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    //Desenvolva aqui a lógica de implementação
    console.log('Atributos:')
    console.log(`${req.body.alignment}\n`)    
    

    
    //Fim da execução do middleware
    next();
  }
}
