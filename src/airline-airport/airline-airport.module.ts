import { Module } from '@nestjs/common';
import { AirlineEntity } from '../airline/airline.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineAirportController } from './airline-airport.controller';
import { AirportEntity } from '../airport/airport.entity';
import { AirlineAirportService } from './airline-airport.service';

@Module({
  imports: [TypeOrmModule.forFeature([AirportEntity, AirlineEntity])],
  providers: [AirlineAirportService],
  controllers: [AirlineAirportController],
})
export class AirlineAirportModule {}
