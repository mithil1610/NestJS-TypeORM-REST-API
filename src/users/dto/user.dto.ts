import { IsEmail, IsNotEmpty, IsNumber, IsString, IsDefined } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    name: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    password: string;
    
    @IsString()
    phoneno: string;
    
    @IsString()
    address: string;
}

export class UpdateUserDto {
    @IsString()
    id: string;

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    name: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    password: string;
    
    @IsString()
    phoneno: string;

    @IsString()
    address: string;
}
