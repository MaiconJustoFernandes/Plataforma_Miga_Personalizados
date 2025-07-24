import { IsString, IsNotEmpty, IsNumber, IsPositive, IsArray, ValidateNested, IsUUID, Length } from 'class-validator';
import { Type } from 'class-transformer';

class CompositionDto {
  @IsUUID()
  @IsNotEmpty()
  insumId: string;

  @IsNumber()
  @IsPositive()
  quantityUsed: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @IsNumber()
  @IsPositive()
  salePrice: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompositionDto)
  composition: CompositionDto[];
}
