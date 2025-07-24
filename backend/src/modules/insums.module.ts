import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsumsController } from './insums.controller';
import { InsumsService } from './insums.service';
import { Insum } from './insums/entities/insum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Insum])],
  controllers: [InsumsController],
  providers: [InsumsService],
})
export class InsumsModule {}
