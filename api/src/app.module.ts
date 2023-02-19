import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterModule } from './character/character.module';
import { WarcraftLogsModule } from './warcraft-logs/warcraft-logs.module';

@Module({
  imports: [WarcraftLogsModule, CharacterModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
