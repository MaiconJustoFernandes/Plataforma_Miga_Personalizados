import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insum } from './entities/insum.entity';
import { CreateInsumDto } from './dto/create-insum.dto';
import { UpdateInsumDto } from './dto/update-insum.dto';

@Injectable()
export class InsumsService {
  constructor(
    @InjectRepository(Insum)
    private readonly insumRepository: Repository<Insum>,
  ) {}

  async create(createInsumDto: CreateInsumDto): Promise<Insum> {
    const insum = this.insumRepository.create(createInsumDto);
    return this.insumRepository.save(insum);
  }

  async findAll(): Promise<Insum[]> {
    return this.insumRepository.find();
  }

  async findOne(id: string): Promise<Insum> {
    const insum = await this.insumRepository.findOne({ where: { id } });
    if (!insum) {
      throw new NotFoundException(`Insum with ID "${id}" not found`);
    }
    return insum;
  }

  async update(id: string, updateInsumDto: UpdateInsumDto): Promise<Insum> {
    const insum = await this.insumRepository.preload({
      id: id,
      ...updateInsumDto,
    });
    if (!insum) {
      throw new NotFoundException(`Insum with ID "${id}" not found`);
    }
    return this.insumRepository.save(insum);
  }

  async remove(id: string): Promise<void> {
    const result = await this.insumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Insum with ID "${id}" not found`);
    }
  }
}
