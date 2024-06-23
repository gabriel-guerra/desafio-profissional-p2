import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Character, CharacterShema } from "./schemas/character.schema";
import { CharacterController } from "./characters.controller";
import { CharacterService } from "./characters.service";
import { AttributesMiddleware } from "./middleware/attributes.middleware";
import { AlignmentsMiddleware } from "./middleware/alignments.middleware";
import { FeatsMiddleware } from "./middleware/feats.middleware";
import { ItemsMiddleware } from "./middleware/items.middleware";
import { MagicMiddleware } from "./middleware/magic.middleware";

@Module({
    imports: [MongooseModule.forFeature([{name: Character.name, schema: CharacterShema}])],
    controllers: [CharacterController],
    providers: [CharacterService],
    exports: [CharacterService],
})

export class CharacterModule{
    configure(consumer: MiddlewareConsumer){
        consumer.apply(AlignmentsMiddleware, AttributesMiddleware, FeatsMiddleware, ItemsMiddleware, MagicMiddleware)
        .forRoutes({path: 'character*',  method: RequestMethod.POST});
    }
}