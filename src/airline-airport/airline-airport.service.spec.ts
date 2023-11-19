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

  it('addAirportToAirline should add an airport to an airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      id: faker.company.name(),
      name: faker.company.name(),
      code: faker.company.name(),
      country: faker.company.name(),
      city: faker.company.name(),
      airlines: [],
    });

    const newAirline: AirlineEntity = await airlineRepository.save({
      id: faker.company.name(),
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.recent(),
      webUrl: faker.image.url(),
      airports: [],
    });

    const result: AirlineEntity = await service.addAirlineToAirport(
      newAirline.id,
      newAirport.id,
    );

    expect(result.airports.length).toBe(1);
    expect(result.airports[0]).not.toBeNull();
    expect(result.airports[0].name).toBe(newAirport.name);
    expect(result.airports[0].code).toBe(newAirport.code);
    expect(result.airports[0].country).toBe(newAirport.country);
    expect(result.airports[0].city).toBe(newAirport.city);
  });

  it('findAirportsByAirline should return airports by airlines', async () => {
    const storedAirport: AirportEntity[] = await service.findAirportsByAirline(
      airline.id,
    );
    expect(storedAirport).not.toBeNull();
  });

  it('findAirportByAirline should return airports by airlines', async () => {
    const airport: AirportEntity = airportsList[0];
    const storedAirport: AirportEntity = await service.findAirportFromAirline(
      airline.id,
      airport.id,
    );
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toBe(airport.name);
    expect(storedAirport.code).toBe(airport.code);
    expect(storedAirport.country).toBe(airport.country);
    expect(storedAirport.city).toBe(airport.city);
  });

  it('deleteAirportFromAirline should no error', async () => {
    const airport: AirportEntity = airportsList[0];
    const deletedAirport = await service.deleteAirportFromAirline(
      airline.id,
      airport.id,
    );
    expect(deletedAirport).toBeUndefined();
  });
});
