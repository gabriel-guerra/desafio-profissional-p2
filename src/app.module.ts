import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterModule } from './characters/characters.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://0.0.0.0/d5p2'), CharacterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
