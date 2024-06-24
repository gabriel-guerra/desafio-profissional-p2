import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class FeatsMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    
    /* const nivel = req.body.level || 0;

    if (nivel % 4 === 0) {
      try {
        if (req.body.feats.length === 0) {
          throw new Error('Você precisa escolher um talento (feat) da API D&D 5e.');
        }

        const featUrls = req.body.feats.filter((feat: string) => feat.startsWith('https://www.dnd5eapi.co/api/feats/'));

        const featsPromises = featUrls.map((featUrl: string) => axios.get(featUrl));
        const featsResponses = await Promise.all(featsPromises);
        const featsData = featsResponses.map((response) => response.data);

        console.log('Feats escolhidos:');
        featsData.forEach((feat) => console.log(`- ${feat.name}: ${feat.desc}`));

        const attributesToIncrease = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        const chosenAttribute = attributesToIncrease[Math.floor(Math.random() * attributesToIncrease.length)];

        console.log(`Aumentou +2 no atributo ${chosenAttribute}.`);
        
      } catch (error) {
        console.error('Erro ao processar escolha:', error.message);
      }
    } */

    next();
  }
}
