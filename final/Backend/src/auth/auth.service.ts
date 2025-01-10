/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schma';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private useModel: Model<User>,
        private jwtService: JwtService,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        const { name, email, password } = signUpDto;

        
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await this.useModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = this.jwtService.sign({ id: user._id }, { expiresIn: '1h' });

        return { token };
    }

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;

        // Find user by email
        const user = await this.useModel.findOne({ email });
        if (!user) {
            throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
        }

        // Compare passwords
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
        }

        // Generate JWT token
        const token = this.jwtService.sign({ id: user._id }, { expiresIn: '1h' });

        return { token };
    }
}
