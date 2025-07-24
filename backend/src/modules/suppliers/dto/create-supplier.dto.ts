import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(14, 18)
  cnpj: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
