import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AlignmentsMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {

    async function verificaAlinhamentos(alinhamentoEscolhido: string) {
      
      let valor = 0;
      try {
            const respostaApi = await fetch("https://www.dnd5eapi.co/api/alignments/");
            const dados = await respostaApi.json();
          
            dados.results.forEach(alinhamento => {
                if (alinhamento.name.toLowerCase() === alinhamentoEscolhido.toLocaleLowerCase()) {
                    valor = 1;
                }
            });
  
          if (valor !== 1) return false; else return true
          
        } catch (erro) {
            console.log("Algo deu errado", erro);
        }
    }

    const checkAlignments = await verificaAlinhamentos(req.body.alignment);
    if (!checkAlignments) return res.status(400).send(`Alinhamento inválido`)
    next(); 
  }
}
