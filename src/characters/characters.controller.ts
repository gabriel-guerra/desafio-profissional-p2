import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { Character } from "./schemas/character.schema";
import { CharacterService } from "./characters.service";
import { UpdateCharacterDto } from "./dto/update-character.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { NotUpdatedException } from "./exceptions/not-updated-exception";

@UseGuards(AuthGuard)
@Controller('character')
export class CharacterController{
    constructor(private readonly characterService: CharacterService){}

    @Post()
    async create(@Body() createCharDto: CreateCharacterDto): Promise<Character>{
        try{
            return this.characterService.create(createCharDto)
        }catch(e){
            throw new HttpException({}, HttpStatus.BAD_REQUEST)
        }
    }

    @Get()
    async findAll(): Promise<Character[]>{
        try{
            return this.characterService.findAll();
        }catch(e){
            throw new HttpException({}, HttpStatus.NOT_FOUND)
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Character>{
        try{
            return this.characterService.findById(id)
        }catch(e){
            throw new HttpException({}, HttpStatus.NOT_FOUND)
        }
    }

    @Post(':id')
    @HttpCode(200)
    update(@Param('id') id: string, @Body() updateCatDto: UpdateCharacterDto){
        try{
            return this.characterService.update(id, updateCatDto);
        }catch(e){
            throw new NotUpdatedException();
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