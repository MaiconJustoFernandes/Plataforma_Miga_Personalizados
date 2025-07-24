import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { Supplier } from './suppliers/entities/supplier.entity';
import { InsumsModule } from './insums.module';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier]), InsumsModule],
  controllers: [SuppliersController],
  providers: [SuppliersService],
})
export class SuppliersModule {}
