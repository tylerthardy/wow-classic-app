import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WarcraftLogsModule } from './warcraft-logs/warcraft-logs.module';

@Module({
  imports: [WarcraftLogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
