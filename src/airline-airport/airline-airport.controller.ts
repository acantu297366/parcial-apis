import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { plainToInstance } from 'class-transformer';
import { AirportDto } from '../airport/airport.dto';
import { AirportEntity } from '../airport/airport.entity';

@Controller('airlines')
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

  @Put(':airlineId/airports')
  async updateAirportsFromAirline(
    @Body() airportsDto: AirportDto[],
    @Param('airlineId') airlineId: string,
  ) {
    const airports = plainToInstance(AirportEntity, airportsDto);
    console.log(airports); // BORRAR esta linea
    return await this.airlineAirportService.updateAirportsFromAirline(
      airlineId,
      'airports', //VALIDAR BIEN ESTA PARTE
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
