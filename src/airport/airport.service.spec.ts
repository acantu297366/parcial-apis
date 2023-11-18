import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { Repository } from 'typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirportEntity } from './airport.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airportList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airportList = [];
    const airport: AirportEntity = await repository.save({
      id: faker.company.name(),
      name: faker.company.name(),
      code: faker.company.name(),
      country: faker.company.name(),
      city: faker.company.name(),
      airlines: [],
    });
    airportList.push(airport);
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airports', async () => {
    const airports: AirportEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(airports.length);
  });

  it('findOne should return an airport by id', async () => {
    const storedAirport: AirportEntity = airportList[0];
    const airport: AirportEntity = await service.findOne(storedAirport.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedAirport.name);
    expect(airport.code).toEqual(storedAirport.code);
    expect(airport.country).toEqual(storedAirport.country);
    expect(airport.city).toEqual(storedAirport.city);
  });

  it('create should return a new airport', async () => {
    const airport: AirportEntity = {
      id: faker.company.name(),
      name: faker.company.name(),
      code: faker.company.name(),
      country: faker.company.name(),
      city: faker.company.name(),
      airlines: [],
    };

    const newAirport: AirportEntity = await service.create(airport);
    expect(newAirport).not.toBeNull();

    const storedAirport: AirportEntity = await repository.findOne({
      where: { id: newAirport.id },
    });
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(newAirport.name);
    expect(storedAirport.code).toEqual(newAirport.code);
    expect(storedAirport.country).toEqual(newAirport.country);
    expect(storedAirport.city).toEqual(newAirport.city);
  });

  it('update should modify an airport', async () => {
    const airport: AirportEntity = airportList[0];
    airport.name = 'New name';
    const updatedAirport: AirportEntity = await service.update(
      airport.id,
      airport,
    );
    expect(updatedAirport).not.toBeNull();
    const storedAirport: AirportEntity = await repository.findOne({
      where: { id: airport.id },
    });
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(airport.name);
  });

  it('delete should remove an airport', async () => {
    const airport: AirportEntity = airportList[0];
    await service.delete(airport.id);
    const deletedAirport: AirportEntity = await repository.findOne({
      where: { id: airport.id },
    });
    expect(deletedAirport).toBeNull();
  });
});
