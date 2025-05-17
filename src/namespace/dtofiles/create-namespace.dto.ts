/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject } from 'class-validator';

export class createNameSpaceDto {
  @ApiProperty({ example: 'nihithns', description: 'Name of the namespace' })
  @IsString()
  name: string;

  @ApiProperty({
    example: { 'kubernetes.azure.com/managedby': 'aks', 'createby': 'Nihith' },
    description: 'Labels as key-value pairs',
    required: false,
    additionalProperties: { type: 'string' }
  })
  @IsOptional()
  @IsObject()
  labels?: Record<string, string>;
}