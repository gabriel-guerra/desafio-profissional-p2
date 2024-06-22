import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterModule } from './characters/characters.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ResLogger } from './res-logger.middleware';

@Module({
  imports: [MongooseModule.forRoot('mongodb://0.0.0.0/d5p2'), CharacterModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(ResLogger)
    .forRoutes('*');
}
}
