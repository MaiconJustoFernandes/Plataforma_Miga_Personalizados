import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Logger,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`Iniciando processo de registro para o email: ${createUserDto.email}`);
    const user = await this.usersService.create(createUserDto);
    this.logger.log(`Usuário registrado com sucesso: ${user.email}`);
    return user;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard) // Protege a rota, garantindo que apenas usuários autenticados possam acessá-la.
  getProfile(@Request() req) {
    // O objeto `req.user` é populado pela estratégia JWT (JwtStrategy)
    // após a validação do token. Ele contém os dados do usuário
    // que foram incluídos no payload do token durante o login.
    return req.user;
  }
}
