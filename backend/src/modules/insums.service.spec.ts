import { Test, TestingModule } from '@nestjs/testing';
import { InsumsService } from './insums.service';

describe('InsumsService', () => {
  let service: InsumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsumsService],
    }).compile();

    service = module.get<InsumsService>(InsumsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
