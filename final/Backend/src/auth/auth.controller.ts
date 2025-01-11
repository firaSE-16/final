/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Get, Req, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('/signup')
    signUp(
        @Body()  signUpDto
    ):Promise<{token:string}>{
    return this.authService.signUp(signUpDto);
    }
    @Post('/login')
    login(
        @Body()  loginDto:LoginDto
    ):Promise<{token:string}>{
    return this.authService.login(loginDto);
    }
    @Post('logout')
    async logout(@Req() req): Promise<{ message: string }> {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new HttpException('Token not provided', HttpStatus.BAD_REQUEST);
        }
        return this.authService.logout(token);
    }
   

}
