import { Module } from '@nestjs/common';
import { AirlineService } from '../airline/airline.service';
import { AirlineEntity } from '../airline/airline.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AirlineEntity])],
  providers: [AirlineService],
})
export class AirlineAirportModule {}
