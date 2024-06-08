import { IsArray, IsIn, IsNumber, IsObject, IsString } from "class-validator";

export class CreateCharacterDto{

    @IsString()
    name: string;

    @IsNumber()
    level: number;

    @IsString()
    @IsIn(['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'])
    class: string;

    @IsString()
    @IsIn(['dragonborn', 'dwarf', 'elf', 'gnome', 'half-elf', 'half-orc', 'halfling', 'human', 'tiefling'])
    race: string;

    @IsObject()
    attributes: Record<string, any>;

    @IsArray()
    @IsString({ each: true })
    feats: string[];

    @IsString()
    alignment: string;

    @IsArray()
    @IsString({ each: true })
    magic: string[];

    @IsArray()
    @IsString({ each: true })
    items: string[];
}