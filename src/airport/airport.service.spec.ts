import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { Repository } from 'typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirportEntity } from './airport.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
