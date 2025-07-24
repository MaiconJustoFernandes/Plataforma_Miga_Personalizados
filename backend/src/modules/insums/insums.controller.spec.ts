import { Test, TestingModule } from '@nestjs/testing';
import { InsumsController } from './insums.controller';

describe('InsumsController', () => {
  let controller: InsumsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsumsController],
    }).compile();

    controller = module.get<InsumsController>(InsumsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
