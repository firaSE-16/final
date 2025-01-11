import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schma';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    private tokenBlacklist = new Set<string>(); 

    constructor(
        @InjectModel(User.name)
        private useModel: Model<User>,
        private jwtService: JwtService,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        const { name, email, password } = signUpDto;

        // Check if the user already exists
        const existingUser = await this.useModel.findOne({ email });
        if (existingUser) {
            throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.useModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = this.jwtService.sign({ id: user._id }, { expiresIn: '1h' });

        return { token };
    }

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;

        const user = await this.useModel.findOne({ email });
        if (!user) {
            throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
        }

        
        const token = this.jwtService.sign({ id: user._id }, { expiresIn: '1h' });

        return { token };
    }

    async logout(token: string): Promise<{ message: string }> {
      
        this.tokenBlacklist.add(token);

        return { message: 'Successfully logged out' };
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        return this.tokenBlacklist.has(token);
    }

    async validateToken(token: string): Promise<boolean> {
        
        const isBlacklisted = await this.isTokenBlacklisted(token);
        if (isBlacklisted) {
            throw new HttpException('Token is invalidated', HttpStatus.UNAUTHORIZED);
        }

      
        try {
            this.jwtService.verify(token);
            return true;
        } catch (error) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
    }
}
