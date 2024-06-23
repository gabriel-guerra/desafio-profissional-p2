import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AttributesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    const atributos = req.body.attributes;
    const ptsLimite = 27;
    const tabelaCusto = {
      8:0,
      9:1,
      10:2,
      11:3,
      12:4,
      13:5,
      14:7,
      15:9
    };

    let ptsGastos = 0;
    let detalhes = [];

    for(let atributo in atributos) {
      let valor = atributos[atributo];

      if (valor < 8 || valor > 15) return res.status(400).send(`Valor inválido para ${atributo}. Deve estar entre 8 e 15.`);

      ptsGastos += tabelaCusto[valor];
      detalhes.push(`${atributo}: ${valor} (custo: ${tabelaCusto[valor]})`);
    }

    if(ptsGastos > ptsLimite) return res.status(400).send(`Pontos gastos (${ptsGastos}) excedem o limite de ${ptsLimite}. Detalhes: ${detalhes.join(', ')}`);
    
    next();
  }
}

