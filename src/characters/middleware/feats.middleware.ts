import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FeatsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    //Desenvolva aqui a lógica de implementação
    console.log('Feats:')
    for (const f of req.body.feats){
        console.log(`${f}`)
    }
    console.log('\n')
    

    
    
    //Fim da execução do middleware
    next();
  }
}
