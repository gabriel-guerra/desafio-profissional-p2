import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MagicMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const characterClass = req.body.class.toLowerCase();
            const characterLevel = req.body.level;
            const magics = req.body.magic;

            // Verificar se a classe pode usar magias
            const canUseMagic = await this.canClassUseMagic(characterClass);

            if (!canUseMagic) {
                // A classe não pode usar magias
                if (!magics || magics.length === 0) {
                    // Se não houver magias digitadas, pode continuar
                    console.log('Classe não pode usar magia e nenhuma magia foi digitada. Continuando...');
                    next();
                } else {
                    // Se houver magias digitadas, lançar exceção
                    throw new Error('Classe não pode usar magia, mas magias foram digitadas.');
                }
            } else {
                // A classe pode usar magias
                // Obter todas as magias da classe
                const spells = await this.getAllSpellsForClass(characterClass);

                // Filtrar as magias que o personagem pode lançar com base no nível
                const castableSpells = spells.filter(spell => spell.level <= characterLevel);

                // Verificar se todas as magias digitadas estão na lista de magias que o personagem pode lançar
                if (magics && magics.length > 0) {
                    for (const magic of magics) {
                        const foundSpell = castableSpells.find(spell => spell.name.toLowerCase() === magic.toLowerCase());
                        if (!foundSpell) {
                            throw new Error(`Magia "${magic}" não encontrada ou não pode ser lançada pelo personagem.`);
                        }
                    }
                }

                console.log('Validação de magias concluída com sucesso.');
                next();
            }
        } catch (error) {
            console.error('Erro durante a validação de magias:', error);
            throw new HttpException('Dados inválidos para criar o personagem.', HttpStatus.BAD_REQUEST);
        }
    }

    async canClassUseMagic(characterClass: string): Promise<boolean> {
        try {
            // Consultar a API D&D 5th Edition para obter detalhes da classe
            const response = await axios.get(`https://www.dnd5eapi.co/api/classes/${characterClass}`);
            
            // Verificar se a classe possui características de magia
            const spellcasting = response.data.spellcasting;
            return spellcasting !== undefined && spellcasting !== null;
        } catch (error) {
            console.error(`Erro ao consultar API para classe ${characterClass}:`, error);
            throw new Error(`Não foi possível determinar se a classe ${characterClass} pode usar magias.`);
        }
    }

    async getAllSpellsForClass(characterClass: string): Promise<any[]> {
        try {
            // Consultar a API D&D 5th Edition para obter todas as magias da classe
            const response = await axios.get(`https://www.dnd5eapi.co/api/classes/${characterClass}/spells`);
            const spellUrls = response.data.results;

            // Para cada URL de magia, buscar os detalhes completos
            const promises = spellUrls.map(async (spell) => {
                const spellResponse = await axios.get(`https://www.dnd5eapi.co${spell.url}`);
                return spellResponse.data;
            });

            return Promise.all(promises);
        } catch (error) {
            console.error(`Erro ao consultar API para magias da classe ${characterClass}:`, error);
            throw new Error(`Não foi possível obter a lista de magias para a classe ${characterClass}.`);
        }
    }
}
