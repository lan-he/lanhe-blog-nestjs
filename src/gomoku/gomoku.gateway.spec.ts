import { Test, TestingModule } from '@nestjs/testing';
import { GomokuGateway } from './gomoku.gateway';

describe('GomokuGateway', () => {
  let gateway: GomokuGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GomokuGateway],
    }).compile();

    gateway = module.get<GomokuGateway>(GomokuGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
