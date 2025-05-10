import { IsOptional, IsString, IsObject } from 'class-validator';

export class createNameSpaceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsObject()
  labels?: Record<string, string>;
}