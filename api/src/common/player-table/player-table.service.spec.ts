import { Test, TestingModule } from '@nestjs/testing';
import { PlayerTableService } from './player-table.service';

describe('PlayerTableService', () => {
  let service: PlayerTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerTableService],
    }).compile();

    service = module.get<PlayerTableService>(PlayerTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
