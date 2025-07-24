import { IsString, IsNotEmpty, IsNumber, IsPositive, Length } from 'class-validator';

export class CreateInsumDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  unitOfMeasure: string;

  @IsNumber()
  @IsPositive()
  stock: number;

  @IsNumber()
  @IsPositive()
  averageCost: number;
}
