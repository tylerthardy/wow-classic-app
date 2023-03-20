import { Module } from '@nestjs/common';
import { AppConfig } from './app-config';
import { AppConfigModule } from './app-config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterModule } from './character/character.module';
import { SpecializationModule } from './specialization/specialization.module';
import { WarcraftLogsModule } from './warcraft-logs/warcraft-logs.module';

@Module({
  imports: [AppConfigModule, WarcraftLogsModule, CharacterModule, SpecializationModule],
  controllers: [AppController],
  providers: [AppService, AppConfig]
})
export class AppModule {}
