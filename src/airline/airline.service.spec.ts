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

  it('findOne should return an airline by id', async () => {
    const storedAirline: AirlineEntity = airlineList[0];
    const airline: AirlineEntity = await service.findOne(storedAirline.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedAirline.name);
    expect(airline.foundationDate).toEqual(storedAirline.foundationDate);
    expect(airline.webUrl).toEqual(storedAirline.webUrl);
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne('10000')).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('create should return a new airline', async () => {
    const airline: AirlineEntity = {
      id: faker.company.name(),
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.recent(),
      webUrl: faker.image.url(),
      airports: [],
    };

    const newAirline: AirlineEntity = await service.create(airline);
    expect(newAirline).not.toBeNull();

    const storedAirline: AirlineEntity = await airlineRepository.findOne({
      where: { id: newAirline.id },
    });
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(newAirline.name);
    expect(storedAirline.description).toEqual(newAirline.description);
    expect(storedAirline.foundationDate).toEqual(newAirline.foundationDate);
    expect(storedAirline.webUrl).toEqual(newAirline.webUrl);
  });

  it('update should modify an airline', async () => {
    const airline: AirlineEntity = airlineList[0];
    airline.name = 'New name';
    const updatedAirline: AirlineEntity = await service.update(
      airline.id,
      airline,
    );
    expect(updatedAirline).not.toBeNull();
    const storedAirline: AirlineEntity = await airlineRepository.findOne({
      where: { id: airline.id },
    });
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(airline.name);
    expect(storedAirline.description).toEqual(airline.description);
  });

  it('delete should remove an airline', async () => {
    const airline: AirlineEntity = airlineList[0];
    await service.delete(airline.id);
    const deletedAirline: AirlineEntity = await airlineRepository.findOne({ where: { id: airline.id } })
    expect(deletedAirline).toBeNull();
  });
});
