import {
  Controller,
  GatewayTimeoutException,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  HttpException,
  Delete,
} from '@nestjs/common';
import { PodService } from './pod.service';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('pod')
export class PodController {
  constructor(private _podService: PodService) {}

  @Get('listAll')
  @ApiOperation({
    summary: 'List pods across all namespace',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: 201,
    description: 'Pods retrived successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Not able to retrive the list',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  Listallpods(): any {
    const result = this._podService.listpods();
    return result;
  }

  @Get(':namespace/listAll')
  @ApiOperation({
    summary: 'List pods by namespace',
  })
  @ApiParam({
    name: 'namespace',
    description:
      'The Kubernetes namespace to list pods from',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of pod names',
    type: [String],
  })
  @ApiResponse({
    status: 404,
    description: 'Namespace not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async listPodsByNamespace(
    @Param('namespace') namespace: string,
  ): Promise<any> {
    try {
      const podNames =
        await this._podService.listpodsbyNamespace(
          namespace,
        );
      console.log(podNames);
      if (!podNames || podNames.length === 0) {
        throw new HttpException(
          'Namespace not found or no pods available',
          HttpStatus.NOT_FOUND,
        );
      }
      return podNames;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // Log error here or handle as needed
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':namespace/pods/:podName')
  @ApiOperation({
    summary:
      'Delete a pod by name in a namespace',
  })
  @ApiParam({
    name: 'podName',
    description: 'The name of the pod to delete',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Pod deletion status returned',
    type: String,
    example: 'Pod deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Pod or namespace not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })

  
  async deletePod(
    @Param('namespace') namespace: string,
    @Param('podName') podName: string,
  ): Promise<any> {
    const result =
      await this._podService.deletePod(
        namespace,
        podName,
      );
    if (!result) {
      throw new HttpException(
        'Pod or namespace not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return `Pod ${podName} deleted successfully in namespace ${namespace}`;
  }
}
