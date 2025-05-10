import { Controller, Get, Param, Post, Body , HttpCode , HttpStatus , BadGatewayException, Delete } from '@nestjs/common';
import { NamespaceService } from './namespace.service';
import { createNameSpaceDto } from './dtofiles/create-namespace.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('namespace')
export class NamespaceController {
  constructor(
    private _namespace: NamespaceService,
  ) {}
  
  @Get('listNamespace')
  listnamespace(): any {
    return this._namespace.listingnamespace();
  }

  @Get('getNamespace/:name')
  @HttpCode(HttpStatus.CREATED) // 👈 Default for successful creation
  @ApiResponse({ status: 201, description: 'Namespace created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request or namespace creation failed.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  getnamespace(@Param('name') name: string): any {
    const result =  this._namespace.getNamespace(name);
    if (!result) {
      throw new BadGatewayException(`Namespace ${name} not found`);
    }

    return {
      message: `Namespace Found ${name}.`,
      data: result,
    };
  }

  @Post('createNamespace')
  @HttpCode(HttpStatus.CREATED) // 👈 Default for successful creation
  @ApiResponse({ status: 201, description: 'Namespace created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request or namespace creation failed.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createNamespace(
    @Body() dto: createNameSpaceDto,
  ): Promise<any> {
    const result = await this._namespace.createNameSpace(dto.name, dto.labels);

    if (!result) {
      throw new BadGatewayException(`Namespace ${dto.name} creation failed`);
    }

    return {
      message: `Namespace '${dto.name}' created successfully.`,
      data: result,
    };
  }

  @Delete('DeleteNamespace/:name')
  @HttpCode(HttpStatus.CREATED) // 👈 Default for successful creation
  @ApiResponse({ status: 201, description: 'Namespace deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request or namespace deletion failed.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteNamespace(
    @Param('name') name: string
  ): Promise<any> {
    const result =
      await this._namespace.deleteNamespace(name);

    if (!result) {
      throw new BadGatewayException(`Namespace ${name} deletion failed`);
    }

    return {
      message: `Namespace '${name}' deleted successfully.`,
      data: result,
    };
  }

}