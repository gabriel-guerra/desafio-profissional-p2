import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class FeatsMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const nivel = req.body.level || 0;

    // Verifica se o nível é um múltiplo de 4
    if (nivel % 4 === 0) {
      try {
        if (req.body.feats.length === 0) {
          throw new Error('Você precisa escolher um talento (feat) da API D&D 5e.');
        }

        // Filtra apenas os feats que são URLs válidas da API D&D 5e
        const featUrls = req.body.feats.filter((feat: string) => feat.startsWith('https://www.dnd5eapi.co/api/feats/'));

        // Faz uma requisição para cada URL de feat para obter detalhes
        const featsPromises = featUrls.map((featUrl: string) => axios.get(featUrl));
        const featsResponses = await Promise.all(featsPromises);
        const featsData = featsResponses.map((response) => response.data);

        // Log dos feats adquiridos
        console.log('Feats escolhidos:');
        featsData.forEach((feat) => console.log(`- ${feat.name}: ${feat.desc}`));

        // Aumenta um atributo em +2
        const attributesToIncrease = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        const chosenAttribute = attributesToIncrease[Math.floor(Math.random() * attributesToIncrease.length)];
        // Simulando o aumento em +2 no atributo
        console.log(`Aumentou +2 no atributo ${chosenAttribute}.`);
        
      } catch (error) {
        console.error('Erro ao processar escolha:', error.message);
      }
    }
    // Fim da execução do middleware
    next();
  }
}
