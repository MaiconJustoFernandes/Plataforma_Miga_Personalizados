
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsDateString, Length } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 18)
  cpfCnpj: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  whatsapp: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsDateString()
  @IsOptional()
  birthDate: Date;

  @IsString()
  @IsOptional()
  origin: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 9)
  cep: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsOptional()
  complement: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  state: string;
}
