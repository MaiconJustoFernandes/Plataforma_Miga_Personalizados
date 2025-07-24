import { IsString, IsNotEmpty, IsNumber, IsPositive, Length } from 'class-validator';

export class CreateInsumDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  unitOfMeasurement: string;

  @IsNumber()
  @IsPositive()
  currentStock: number;

  @IsNumber()
  @IsPositive()
  averageCost: number;
}
