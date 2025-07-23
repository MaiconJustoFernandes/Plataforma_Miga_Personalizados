import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your_super_secret',
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.usersService.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Token inválido ou usuário não encontrado.');
    }

    // Retorna os dados seguros do usuário (sem a senha)
    return { 
      id: user.id,
      name: user.name,
      email: user.email, 
      profile_type: user.profile_type 
    };
  }
}
