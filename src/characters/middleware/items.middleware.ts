import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ItemsMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const characterClass = req.body.class.toLowerCase();
      const items = req.body.items.map(item => item.toLowerCase());

      // Obter itens permitidos e itens iniciais da classe
      const { allowedItems, choiceGroups } = await this.getAllowedItemsForClass(characterClass);
      const initialItems = await this.getInitialItemsForClass(characterClass);

      if (!allowedItems || !initialItems) {
        throw new HttpException('Classe não reconhecida.', HttpStatus.BAD_REQUEST);
      }

      const invalidItems = [];
      const chosenItems = new Set<string>();

      // Verificar se os itens recebidos estão entre os permitidos e se apenas uma escolha foi feita por conjunto de opções
      for (const item of items) {
        const itemExists = allowedItems.includes(item) || initialItems.includes(item);
        if (!itemExists) {
          invalidItems.push(item);
        } else if (allowedItems.includes(item)) {
          // Verifica se o item pertence a algum grupo de escolha
          const group = choiceGroups.find(group => group.includes(item));
          if (group) {
            const alreadyChosenItem = [...chosenItems].find(chosenItem => group.includes(chosenItem));
            if (alreadyChosenItem) {
              invalidItems.push(item);
            } else {
              chosenItems.add(item);
            }
          }
        }
      }

      // Verificar se os itens iniciais obrigatórios estão presentes
      for (const initialItem of initialItems) {
        if (!items.includes(initialItem)) {
          invalidItems.push(initialItem);
        }
      }

      if (invalidItems.length > 0) {
        throw new HttpException(`Itens inválidos encontrados: ${invalidItems.join(', ')}`, HttpStatus.BAD_REQUEST);
      }

      console.log('Validação de equipamentos concluída com sucesso.');
      next();
    } catch (error) {
      console.error('Erro durante a validação de equipamentos:', error.message);
      throw new HttpException('Erro ao validar equipamentos iniciais.', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllowedItemsForClass(characterClass: string): Promise<{ allowedItems: string[], choiceGroups: string[][] }> {
    try {
      const response = await axios.get(`https://www.dnd5eapi.co/api/classes/${characterClass}`);
      const startingEquipmentOptions = response.data.starting_equipment_options;

      if (!startingEquipmentOptions || startingEquipmentOptions.length === 0) {
        throw new Error(`Opções de equipamento inicial não encontradas para a classe ${characterClass}.`);
      }

      const allowedItems: string[] = [];
      const choiceGroups: string[][] = [];

      for (const equipmentChoices of startingEquipmentOptions) {
        if (equipmentChoices.type === 'equipment' && Array.isArray(equipmentChoices.from.options)) {
          const group: string[] = [];
          for (const option of equipmentChoices.from.options) {
            if (option.of && option.of.name) {
              const itemName = option.of.name.toLowerCase();
              allowedItems.push(itemName);
              group.push(itemName);
            } else {
              console.warn('Formato inesperado de opção de equipamento:', option);
            }
          }
          if (group.length > 0) {
            choiceGroups.push(group);
          }
        }
      }

      return { allowedItems, choiceGroups };
    } catch (error) {
      console.error(`Erro ao consultar API para classe ${characterClass}:`, error.message);
      throw new Error(`Não foi possível obter os equipamentos iniciais para a classe ${characterClass}.`);
    }
  }

  async getInitialItemsForClass(characterClass: string): Promise<string[]> {
    try {
      const response = await axios.get(`https://www.dnd5eapi.co/api/classes/${characterClass}`);
      const startingEquipment = response.data.starting_equipment;

      if (!startingEquipment || startingEquipment.length === 0) {
        throw new Error(`Equipamentos iniciais não encontrados para a classe ${characterClass}.`);
      }

      const initialItems: string[] = [];
      for (const equipment of startingEquipment) {
        if (equipment.equipment && equipment.equipment.name) {
          initialItems.push(equipment.equipment.name.toLowerCase());
        } else {
          console.warn('Formato inesperado de equipamento inicial:', equipment);
        }
      }

      return initialItems;
    } catch (error) {
      console.error(`Erro ao consultar API para classe ${characterClass}:`, error.message);
      throw new Error(`Não foi possível obter os equipamentos iniciais para a classe ${characterClass}.`);
    }
  }
}
