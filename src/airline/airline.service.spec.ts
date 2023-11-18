import { Test, TestingModule } from '@nestjs/testing';
import { AirlineService } from './airline.service';
import { AirlineEntity } from './airline.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { AirportEntity } from '../airport/airport.entity';

describe('AirlineService', () => {
  let service: AirlineService;
  let airlineRepository: Repository<AirlineEntity>;
  let airlineList: AirlineEntity[];
  let airportList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    airlineRepository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    airlineRepository.clear();
    airlineList = [];
    const airline: AirlineEntity = await airlineRepository.save({
      id: faker.company.name(),
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.recent(),
      webUrl: faker.image.url(),
      airports: airportList,
    });
    airlineList.push(airline);
    airportList = [];
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines', async () => {
    const airlines: AirlineEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlineList.length);
  });
});
