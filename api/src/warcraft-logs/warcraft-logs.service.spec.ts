import { Test, TestingModule } from '@nestjs/testing';
import { WarcraftLogsService } from './warcraft-logs.service';

describe('WarcraftLogsService', () => {
  let service: WarcraftLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarcraftLogsService],
    }).compile();

    service = module.get<WarcraftLogsService>(WarcraftLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
