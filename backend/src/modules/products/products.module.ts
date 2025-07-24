import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { ProductComposition } from './entities/product-composition.entity';
import { Insum } from '../insums/entities/insum.entity';
import { InsumsModule } from '../insums/insums.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductComposition, Insum]),
    InsumsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
