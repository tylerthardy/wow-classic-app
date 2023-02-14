import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterController } from './character/character.controller';
import { CharacterModule } from './character/character.module';
import { CharacterService } from './character/character.service';
import { ApolloGraphqlModule } from './warcraft-logs/apollo-graphql.module';
import { WarcraftLogsModule } from './warcraft-logs/warcraft-logs.module';
import { WarcraftLogsService } from './warcraft-logs/warcraft-logs.service';

@Module({
  imports: [WarcraftLogsModule, CharacterModule, ApolloGraphqlModule],
  controllers: [AppController, CharacterController],
  providers: [AppService, CharacterService, WarcraftLogsService]
})
export class AppModule {}
