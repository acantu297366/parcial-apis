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

  async updateAirportFromAirline(
    airport: AirportEntity,
    airlineId: string,
    airportId: string,
  ): Promise<AirportEntity[]> {
    let oldAirport: AirportEntity = await this.airportRepository.findOne({
      where: { id: airportId },
      relations: ['airlines'],
    });
    if (!oldAirport) {
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    oldAirport = {
      ...airport,
    };
    await this.airportRepository.save(oldAirport);
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

  async deleteAirportFromAirline(airlineId: string, airportId: string) {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airport: AirportEntity = await this.airportRepository.findOne({
      where: [{ id: airportId }],
      relations: ['airlines'],
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
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

    airline.airports = airline.airports.filter((e) => e.id !== airportId);
    await this.airlineRepository.save(airline);
  }
}
