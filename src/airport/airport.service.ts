import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirportEntity } from '../airport/airport.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(AirportEntity)
    private readonly airportRepository: Repository<AirportEntity>,
  ) {}

  async findAll(): Promise<AirportEntity[]> {
    return await this.airportRepository.find({ relations: ['airlines'] });
  }

  async findOne(id: string): Promise<AirportEntity> {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id },
      relations: ['airlines'],
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return airport;
  }

  async create(airport: AirportEntity): Promise<AirportEntity> {
    return await this.airportRepository.save(airport);
  }

  async update(id: string, airport: AirportEntity): Promise<AirportEntity> {
    const persistedairport: AirportEntity =
      await this.airportRepository.findOne({ where: { id } });
    if (!persistedairport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    airport.id = id;

    return await this.airportRepository.save(airport);
  }

  async delete(id: string) {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id },
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.airportRepository.remove(airport);
  }
}
