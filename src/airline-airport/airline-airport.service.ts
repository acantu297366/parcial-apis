import { Injectable } from '@nestjs/common';
import { AirlineEntity } from '../airline/airline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AirportEntity } from '../airport/airport.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class AirlineAirportService {
  constructor(
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>,

    @InjectRepository(AirportEntity)
    private readonly airportRepository: Repository<AirportEntity>,
  ) {}

  async addAirlineToAirport(
    airlineId: string,
    airportId: string,
  ): Promise<AirlineEntity> {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id: airportId },
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    airline.airports = [...airline.airports, airport];
    return await this.airlineRepository.save(airline);
  }

  async findAirportsByAirline(airlineId: string): Promise<AirportEntity[]> {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return airline.airports;
  }

  async findAirportFromAirline(
    airlineId: string,
    airportId: string,
  ): Promise<AirportEntity> {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id: airportId },
    });
    if (!airportId)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airlineAirport: AirportEntity = airline.airports.find(
      (e) => e.id === airport.id,
    );

    if (!airlineAirport)
      throw new BusinessLogicException(
        'The airport with the given id is not associated to the airline',
        BusinessError.PRECONDITION_FAILED,
      );

    return airlineAirport;
  }

  async updateAirportsFromAirline(
    airlineId: string,
    nameFromAiportToUpdate: string,
  ): Promise<AirportEntity[]> {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    // TODO: Add for loop to update the name field of the airline airports returned
    const newName = nameFromAiportToUpdate;
    console.log(newName);
    return airline.airports;
  }

  async deleteAirportFromAirline(airlineId: string, airportIdToDelete: string) {
    // Verify if after the where is where I have to add and the airportID
    const airportId = airportIdToDelete;
    console.log(airportId);
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );
  }
}
