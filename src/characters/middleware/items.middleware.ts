import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ItemsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    //Desenvolva aqui a lógica de implementação
    console.log('Items:')
    for (const i of req.body.items){
        console.log(`${i}`)
    }
    console.log('\n')
    

    
    
    //Fim da execução do middleware
    next();
  }
}
