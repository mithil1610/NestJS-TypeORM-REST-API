import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
    
    @IsString()
    phoneno: string;

    @IsString()
    address: string;
}
