import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';
import { credsService } from 'src/creds/creds.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class PodService {
  private kc: k8s.KubeConfig;
  private k8sApi: k8s.CoreV1Api;
  private logger: Logger;

  constructor(
    private _credsService: credsService,
  ) {
    const res = this._credsService.loadconfig();
    this.kc = res.kc;
    this.k8sApi = res.k8sApi;
  }

  //list all the pods
  async listpods(): Promise<string[]> {
    const result =
      await this.k8sApi.listPodForAllNamespaces();
    return (await result).items.map(
      (pod) => pod.metadata?.name ?? 'Unknown',
    );
  }

  //list all the pods in a specific namespace
  async listpodsbyNamespace(
    namespace: string,
  ): Promise<string[]> {
    try {
      const result =
        await this.k8sApi.listNamespacedPod({
          namespace,
        });
      const podNames = result.items.map(
        (pod) => pod.metadata?.name ?? 'unknown',
      );
      return podNames;
    } catch (err) {
      this.logger.error(
        `Failed to list pods in namespace ${namespace}`,
        err,
      );
      return [];
    }
  }

  // Restart the pod by deleting it
  async deletePod(
    namespace: string,
    podName: string,
  ): Promise<k8s.V1Status | any> {
    try {
      const result =
        await this.k8sApi.deleteNamespacedPod({
          name: podName,
          namespace: namespace,
        });

      this.logger.log(
        `Pod ${podName} deleted successfully in namespace ${namespace}`,
      );

      return result;
    } catch (err: any) {
      const errorMessage =
        err?.body?.message ||
        err?.message ||
        JSON.stringify(err) ||
        'Unknown error';

      this.logger.error(
        `Failed to delete pod ${podName} in namespace ${namespace}: ${errorMessage}`,
      );

      throw new HttpException(
        `Failed to delete pod: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
