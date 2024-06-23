import { Module } from "@nestjs/common";
import { RandomController } from "./random.controller";
import { RandomService } from "./random.service";
import { CharacterModule } from "src/characters/characters.module";

@Module({
    imports: [CharacterModule],
    controllers: [RandomController],
    providers: [RandomService],
    exports: [],
})

export class RandomModule{}