import { IsEmail, IsNotEmpty, IsString, IsDefined, IsEmpty, Length, IsMobilePhone } from "class-validator";

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
}

export class UpdateUserDto {
    @IsString()
    @IsEmpty()
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
    @Length(10, 10)
    @IsMobilePhone()
    phoneno: string;

    @IsString()
    address: string;
}
