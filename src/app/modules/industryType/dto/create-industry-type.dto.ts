import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIndustryTypeDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}