import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { Product } from './entities/product.entity';
import { ProductComposition } from './entities/product-composition.entity';
import { Insum } from '../insums/entities/insum.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductComposition)
    private readonly productCompositionRepository: Repository<ProductComposition>,
    @InjectRepository(Insum)
    private readonly insumRepository: Repository<Insum>,
  ) {}

  @Transactional()
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { composition, ...productData } = createProductDto;

    // Calcular custo de produção
    let productionCost = 0;
    if (composition && composition.length > 0) {
      for (const item of composition) {
        const insum = await this.insumRepository.findOne({ where: { id: item.insumId } });
        if (!insum) {
          throw new NotFoundException(`Insumo com ID ${item.insumId} não encontrado.`);
        }
        // Garantir que averageCost e quantityUsed são números antes do cálculo
        const insumAverageCost = typeof insum.averageCost === 'number' ? insum.averageCost : 0;
        const itemQuantityUsed = typeof item.quantityUsed === 'number' ? item.quantityUsed : 0;
        productionCost += insumAverageCost * itemQuantityUsed;
      }
    }
    // Garantir que productionCost é um número válido
    productionCost = isNaN(productionCost) ? 0 : productionCost;

    // Calcular margem de lucro
    const profitMargin = productData.salePrice > 0
      ? ((productData.salePrice - productionCost) / productData.salePrice) * 100
      : 0;
    // Garantir que profitMargin é um número válido
    const finalProfitMargin = isNaN(profitMargin) ? 0 : profitMargin;

    try {
      const product = this.productRepository.create({
        ...productData,
        productionCost,
        profitMargin: finalProfitMargin,
      });
      const savedProduct = await this.productRepository.save(product);

      if (composition && composition.length > 0) {
        const compositionEntities = await Promise.all(
          composition.map(async (item) => {
            const insum = await this.insumRepository.findOne({ where: { id: item.insumId } });
            if (!insum) {
              throw new NotFoundException(`Insumo com ID ${item.insumId} não encontrado.`);
            }
            return this.productCompositionRepository.create({
              product: savedProduct,
              insum,
              quantityUsed: item.quantityUsed,
            });
          }),
        );
        await this.productCompositionRepository.save(compositionEntities);
      }

      return this.findOne(savedProduct.id);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error; // Re-lança o erro para que o NestJS ainda o trate como um 500
    }
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['composition', 'composition.insum'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['composition', 'composition.insum'],
    });
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    return product;
  }

  @Transactional()
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const { composition, ...productData } = updateProductDto;

    const product = await this.findOne(id);

    // Remover composição antiga
    await this.productCompositionRepository.delete({ product: { id } });

    // Calcular novo custo de produção
    let productionCost = 0;
    if (composition && composition.length > 0) {
      for (const item of composition) {
        const insum = await this.insumRepository.findOne({ where: { id: item.insumId } });
        if (!insum) {
          throw new NotFoundException(`Insumo com ID ${item.insumId} não encontrado.`);
        }
        productionCost += insum.averageCost * item.quantityUsed;
      }

      // Adicionar nova composição
      const compositionEntities = await Promise.all(
        composition.map(async (item) => {
          const insum = await this.insumRepository.findOne({ where: { id: item.insumId } });
          if (!insum) {
            throw new NotFoundException(`Insumo com ID ${item.insumId} não encontrado.`);
          }
          return this.productCompositionRepository.create({
            product,
            insum,
            quantityUsed: item.quantityUsed,
          });
        }),
      );
      await this.productCompositionRepository.save(compositionEntities);
    }

    // Calcular nova margem de lucro
    const salePrice = productData.salePrice || product.salePrice;
    const profitMargin = salePrice > 0 && productionCost > 0 
      ? ((salePrice - productionCost) / salePrice) * 100 
      : 0;

    // Atualizar dados do produto
    await this.productRepository.update(id, {
      ...productData,
      productionCost,
      profitMargin,
    });

    return this.findOne(id);
  }

  @Transactional()
  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productCompositionRepository.delete({ product: { id } });
    await this.productRepository.delete(id);
  }
}
