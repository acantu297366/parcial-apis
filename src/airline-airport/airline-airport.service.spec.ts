import { Test, TestingModule } from '@nestjs/testing';
import { AirlineAirportService } from './airline-airport.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirportEntity } from '../airport/airport.entity';
import { AirlineEntity } from '../airline/airline.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineRepository: Repository<AirlineEntity>;
  let airportRepository: Repository<AirportEntity>;
  let airline: AirlineEntity;
  let airportsList: AirportEntity[];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineRepository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    airportRepository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    airportRepository.clear();
    airlineRepository.clear();

    airportsList = [];
    for (let i = 0; i < 5; i++) {
      const airport: AirportEntity = await airportRepository.save({
        id: faker.company.name(),
        name: faker.company.name(),
        code: faker.company.name(),
        country: faker.location.country(),
        city: faker.location.city(),
      });
      airportsList.push(airport);
    }

    airline = await airlineRepository.save({
      id: faker.company.name(),
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.company.name(),
      webUrl: faker.image.url(),
      airports: airportsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
