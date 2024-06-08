import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { Character } from "./schemas/character.schema";
import { CharacterService } from "./characters.service";
import { UpdateCharacterDto } from "./dto/update-character.dto";

@Controller('character')
export class CharacterController{
    constructor(private readonly characterService: CharacterService){}

    @Post()
    async create(@Body() createCharDto: CreateCharacterDto): Promise<Character>{
        try{
            return this.characterService.create(createCharDto)
        }catch(e){
            throw new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get()
    async findAll(): Promise<Character[]>{
        try{
            return this.characterService.findAll();
        }catch(e){
            throw new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Character>{
        try{
            return this.characterService.findById(id)
        }catch(e){
            throw new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post(':id')
    @HttpCode(200)
    update(@Param('id') id: string, @Body() updateCatDto: UpdateCharacterDto){
        try{
            return this.characterService.update(id, updateCatDto);
        }catch(e){
            throw new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Delete(':id')
    delete(@Param('id') id: string){
        try{
            return this.characterService.delete(id);
        }catch(e){
            throw new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


}