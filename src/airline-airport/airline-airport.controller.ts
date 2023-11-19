import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { plainToInstance } from 'class-transformer';
import { AirportDto } from '../airport/airport.dto';
import { AirportEntity } from '../airport/airport.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirlineAirportController {
  constructor(private readonly airlineAirportService: AirlineAirportService) {}

  @Post(':airlineId/airports/:airportId')
  async addAirlineToAirport(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airlineAirportService.addAirlineToAirport(
      airlineId,
      airportId,
    );
  }

  @Get(':airlineId/airports/:airportId')
  async findAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airlineAirportService.findAirportFromAirline(
      airlineId,
      airportId,
    );
  }

  @Get(':airportId/airports')
  async findAirportsByAirline(@Param('airportId') airportId: string) {
    return await this.airlineAirportService.findAirportsByAirline(airportId);
  }

  @Put(':airlineId/airports/:airportId')
  async updateAirportFromAirline(
    @Body() airportDto: AirportDto,
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    const airport: AirportEntity = plainToInstance(AirportEntity, airportDto);
    return await this.airlineAirportService.updateAirportFromAirline(
      airport,
      airlineId,
      airportId,
    );
  }

  @Delete(':airlineId/airports/:airportId')
  @HttpCode(204)
  async deleteAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airlineAirportService.deleteAirportFromAirline(
      airlineId,
      airportId,
    );
  }
}
