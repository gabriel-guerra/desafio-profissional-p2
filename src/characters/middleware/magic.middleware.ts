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

            const canUseMagic = await this.canClassUseMagic(characterClass);

            if (!canUseMagic) {
                if (!magics || magics.length === 0) {
                    console.log('Classe não pode usar magia e nenhuma magia foi digitada. Continuando...');
                    next();
                } else {
                    throw new Error('Classe não pode usar magia, mas magias foram digitadas.');
                }
            } else {
                const spells = await this.getAllSpellsForClass(characterClass);
                const castableSpells = spells.filter(spell => spell.level <= characterLevel);

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
            const response = await axios.get(`https://www.dnd5eapi.co/api/classes/${characterClass}`);
            const spellcasting = response.data.spellcasting;
            return spellcasting !== undefined && spellcasting !== null;
        } catch (error) {
            console.error(`Erro ao consultar API para classe ${characterClass}:`, error);
            throw new Error(`Não foi possível determinar se a classe ${characterClass} pode usar magias.`);
        }
    }

    async getAllSpellsForClass(characterClass: string): Promise<any[]> {
        try {
            const response = await axios.get(`https://www.dnd5eapi.co/api/classes/${characterClass}/spells`);
            const spellUrls = response.data.results;

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
