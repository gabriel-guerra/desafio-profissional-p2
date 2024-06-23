import { Injectable } from "@nestjs/common";
import { CreateCharacterDto } from "src/characters/dto/create-character.dto";
import { random } from "./data/data";
import axios from "axios";

@Injectable()
export class RandomService{

    async generate(): Promise<CreateCharacterDto>{

        //const charClass = random.classes[this.randomizeIndexes(random.classes.length)];
        const charClass = 'wizard';
        const level = 13//this.randomizeIndexes(20);
        
        let magic = await this.randomizeSpells(level, charClass);
        if (!magic) magic = []
        let items = await this.randomizeItems(charClass);

        const randomChar = {
            "name": random.names[this.randomizeIndexes(random.names.length)],
            "level": level,
            "class": charClass,
            "race": random.races[this.randomizeIndexes(random.races.length)],
            "attributes": this.randomizeAttributes(),
            "feats": [],
            "alignment": random.alignments[this.randomizeIndexes(random.alignments.length)],
            "magic": magic,
            "items": [ items[this.randomizeIndexes(items.length)] ]
        }
     
        return randomChar;
    }

    randomizeIndexes(size){
        return Math.floor(Math.random() * size);
    }

    async randomizeItems(c): Promise<string[]> {
        const response = await axios.get(`https://www.dnd5eapi.co/api/classes/${c}`);
        const startingEquipmentOptions = response.data.starting_equipment_options;
        
        const itemNames: string[] = [];

        for (const option of startingEquipmentOptions) {
            if (option.from.option_set_type === 'options_array') {
                for (const item of option.from.options) {
                    if (item.option_type === 'counted_reference' && item.of && item.of.name) {
                        itemNames.push(item.of.name);
                    } else if (item.option_type === 'choice' && item.choice.from && item.choice.from.equipment_category) {
                        itemNames.push(item.choice.from.equipment_category.name);
                    }
                }
            }
        }

        return itemNames;
        
    }

    randomizeAttributes(): any{    
        let used = 0;
        const attributes = [];
        const points = 27;
        const cost = {
            8:0,
            9:1,
            10:2,
            11:3,
            12:4,
            13:5,
            14:7,
            15:9
        };
        
        while(attributes.length < 6){
            const min = 8;
            let max = 15;
            let costMax = cost[max];

            while ((points - used) < costMax){
                max--;
                costMax = cost[max];
            }

            const currentValue = (Math.floor(Math.random() * (max - min) + min ));
            attributes.push(currentValue);
            
            used += cost[currentValue];
        }

        const ans = {
            "str": attributes[0],
            "dex": attributes[1],
            "con": attributes[2],
            "int": attributes[3],
            "wis": attributes[4],
            "cha": attributes[5]
        }

        return ans;

    }

    async randomizeSpells(level: number, className: string): Promise<string[]> {
        
        try {
            const response = await axios.get('https://www.dnd5eapi.co/api/spells');
            const allSpells = response.data.results;
        
            const filteredSpellsUrls = allSpells.filter((spell: { url: string }) => spell.url);
            const spellsPromises = filteredSpellsUrls.map((spell: { url: string }) => axios.get(`https://www.dnd5eapi.co${spell.url}`));
            const spellsResponses = await Promise.all(spellsPromises);
        
            const filteredSpells = spellsResponses.map(res => res.data).filter((spell: any) => {
            return spell.level === level && spell.classes.some(c => c.name.toLowerCase() === className.toLowerCase());
            });
        
            if (filteredSpells.length === 0) {
            console.log(`No spells found for level ${level} and class ${className}`);
            return null;
            }
        
            const randomSpell = filteredSpells[Math.floor(Math.random() * filteredSpells.length)];
        
            return randomSpell.name;
        } catch (error) {
            console.error('Error fetching spells:', error);
            return null;
        }
    }     

}