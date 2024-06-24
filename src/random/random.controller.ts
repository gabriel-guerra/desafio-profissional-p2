import { Controller, Get, HttpException, HttpStatus, Inject, UseGuards } from "@nestjs/common";
import { CreateCharacterDto } from "src/characters/dto/create-character.dto";
import { RandomService } from "./random.service";
import { CharacterService } from "src/characters/characters.service";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Controller('random')
export class RandomController{
    constructor(
        private readonly randomService: RandomService,
        private readonly characterService: CharacterService
    ){}

    @Get()
    async randomCharacter(): Promise<CreateCharacterDto>{
        try{
            const char = await this.randomService.generate();
            return await this.characterService.create(char);
        }catch(e){
            throw new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}