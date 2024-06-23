import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Character } from "./schemas/character.schema";
import { Model } from "mongoose";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { UpdateCharacterDto } from "./dto/update-character.dto";

@Injectable()
export class CharacterService{
    constructor(@InjectModel(Character.name) private readonly characterModel: Model<Character>) {}

    async create(createCharDto: CreateCharacterDto): Promise<Character>{
        const char = new this.characterModel(createCharDto);
        return await char.save();
    }

    async findAll(): Promise<Character[]>{
        return await this.characterModel.find().exec();
    }

    async findById(id: string): Promise<Character>{
        try{
            return await this.characterModel.findById(id).exec();
        }catch(e){
            return null;
        }
    }

    async update(id: string, updateCharDto: UpdateCharacterDto): Promise<Character>{
        try{
            return await this.characterModel.findByIdAndUpdate(id, updateCharDto, {new: true});
        }catch(e){
            return null;
        }
    }

    async delete(id: string){
        try{
            return await this.characterModel.findByIdAndDelete(id);
        }catch(e){
            return null;
        }
    }

}