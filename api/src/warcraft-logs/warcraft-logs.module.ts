import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { CharacterModule } from './character/character.module';
import { WarcraftLogsController } from './warcraft-logs.controller';
import { WarcraftLogsService } from './warcraft-logs.service';

const routes: Routes = [
  {
    path: 'character',
    module: CharacterModule
  }
];

@Module({
  controllers: [WarcraftLogsController],
  providers: [WarcraftLogsService],
  imports: [RouterModule.register(routes), CharacterModule]
})
export class WarcraftLogsModule {}
