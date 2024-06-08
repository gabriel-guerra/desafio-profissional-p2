import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AttributesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    //Desenvolva aqui a lógica de implementação
    console.log('Atributos:')
    const att = Object.entries(req.body.attributes);
    for (const [key, value] of att){
        console.log(`${key}, ${value}`)
    }
    console.log('\n')
    
    

    
    //Fim da execução do middleware
    next();
  }
}
