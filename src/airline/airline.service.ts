import { Injectable } from '@nestjs/common';
import { AirlineEntity } from './airline.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>,
  ) {}

  async findAll(): Promise<AirlineEntity[]> {
    return await this.airlineRepository.find({ relations: ['airports'] });
  }

  async findOne(id: string): Promise<AirlineEntity> {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return airline;
  }

  async create(airline: AirlineEntity): Promise<AirlineEntity> {
    const today = new Date();
    const foundationDate = new Date(airline.foundationDate);
    if (foundationDate.toISOString() < today.toISOString()) {
      return await this.airlineRepository.save(airline);
    } else {
      throw new BusinessLogicException(
        'The foundationDate can not be a day greater than today',
        BusinessError.NOT_FOUND,
      );
    }
  }

  async update(id: string, airline: AirlineEntity): Promise<AirlineEntity> {
    const persistedairline: AirlineEntity =
      await this.airlineRepository.findOne({ where: { id } });
    if (!persistedairline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    airline.id = id;

    return await this.airlineRepository.save(airline);
  }

  async delete(id: string) {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id },
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.airlineRepository.remove(airline);
  }
}
