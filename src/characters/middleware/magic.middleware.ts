import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MagicMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    //Desenvolva aqui a lógica de implementação
    console.log('Magic:')
    for (const m of req.body.magic){
        console.log(`${m}`)
    }
    console.log('\n')
    

    
    
    //Fim da execução do middleware
    next();
  }
}
