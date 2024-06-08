import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Character, CharacterShema } from "./schemas/character.schema";
import { CharacterController } from "./characters.controller";
import { CharacterService } from "./characters.service";

@Module({
    imports: [MongooseModule.forFeature([{name: Character.name, schema: CharacterShema}])],
    controllers: [CharacterController],
    providers: [CharacterService],
    exports: [CharacterService],
})

export class CharacterModule{
    // configure(consumer: MiddlewareConsumer){
    //     consumer.apply(logger).forRoutes({path: 'cats*', method: RequestMethod.POST})
    // }
}