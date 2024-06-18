import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AlignmentsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    //Desenvolva aqui a lógica de implementação
    console.log('Atributos:')
    console.log(`${req.body.alignment}\n`)  
    const alinhamentoEscolhido = req.body.alignment;
    async function verificaAlinhamentos(alinhamentoEscolhido: string) {
      var valor = 0;
      try {
          const respostaApi = await fetch("https://www.dnd5eapi.co/api/alignments/");
          const dados = await respostaApi.json();
          
          
          dados.results.forEach(alinhamento => {
              if (alinhamento.name === alinhamentoEscolhido) {
                  valor = 1;
              }
          });
  
          if (valor === 1) {
              return alinhamentoEscolhido;
          } else {
              return "Sem alinhamento";
          }
      } catch (erro) {
          console.log("Algo deu errado", erro);
          return "Erro na verificação";
      }
  }
    //Fim da execução do middleware
    next();
  }
}
