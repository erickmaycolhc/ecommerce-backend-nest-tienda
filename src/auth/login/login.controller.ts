import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserLoginDTO } from './dto/LoginDto';
import { LoginService } from './login.service';

@Controller('auth')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signIn(@Body() userLoginDTO: UserLoginDTO) {
    return this.loginService.signIn(userLoginDTO.correo, userLoginDTO.password);
  }
}
