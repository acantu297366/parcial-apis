import { IsNotEmpty, IsString } from 'class-validator';

export class AirlineDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly foundationDate: Date;

  @IsString()
  @IsNotEmpty()
  readonly webUrl: string;
}
