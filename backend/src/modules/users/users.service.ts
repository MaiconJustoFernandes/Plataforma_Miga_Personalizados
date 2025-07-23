import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password_hash'>> {
    const { name, email, password, profile_type } = createUserDto;

    // Verificar se o email já existe
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Este email já está cadastrado no sistema.');
    }

    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      name,
      email,
      password_hash,
      profile_type,
    });

    const savedUser = await this.usersRepository.save(user);

    // Retorna um objeto simples (POJO) para evitar erros de serialização de referência circular.
    // Isso garante que apenas os dados seguros e necessários sejam expostos na resposta da API.
    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      profile_type: savedUser.profile_type,
      createdAt: savedUser.createdAt,
      deletedAt: savedUser.deletedAt, // Adicionado para cumprir o tipo de retorno
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
