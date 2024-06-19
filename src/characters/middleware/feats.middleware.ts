import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FeatsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    //Desenvolva aqui a lógica de implementação
    //console.log('Feats:')
    //for (const f of req.body.feats){
        //console.log(`${f}`)
    //}
    //console.log('\n')
    async function verificaFeats(classe, nivel, arrayFeatures) {
      try {
          const respostaApi = await fetch(`https://www.dnd5eapi.co/api/classes/${classe}/levels/`);
          const dados = await respostaApi.json();
          
          if (nivel >= 4) {
              const qMaxFeatures = Math.trunc(nivel / 4);
  
              if (arrayFeatures.length <= qMaxFeatures) {
                  let qFeatsAprovados = 0;
  
                  for (let i = 0; i < nivel; i++) {
                      const features = dados[i].features;
  
                      for (let x = 0; x < features.length; x++) {
                          for (let y = 0; y < arrayFeatures.length; y++) {
                              if (features[x].name === arrayFeatures[y]) {
                                  qFeatsAprovados++;
                              }
                          }
                      }
                  }
  
                  if (qFeatsAprovados === arrayFeatures.length) {
                      if (qFeatsAprovados < qMaxFeatures) {
                          const qBonus = qMaxFeatures - qFeatsAprovados;
                          return `Você tem +${qBonus * 2} de bônus, ou mais +${qBonus} de Features.`;
                      } else {
                          return "Você possui o número exato de Features, sem adicional de bônus.";
                      }
                  } else {
                      return "Features incorretas.";
                  }
              } else {
                  return "Você tem mais Features do que o nível permite.";
              }
          } else {
              return "Nível insuficiente.";
          }
      } catch (erro) {
          console.log("Algo deu errado", erro);
          return "Erro na verificação.";
      }
  }

    
    
    //Fim da execução do middleware
    next();
  }
}
