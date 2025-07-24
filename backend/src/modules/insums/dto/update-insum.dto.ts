import { PartialType } from '@nestjs/mapped-types';
import { CreateInsumDto } from './create-insum.dto';

export class UpdateInsumDto extends PartialType(CreateInsumDto) {}
