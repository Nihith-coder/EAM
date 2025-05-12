import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';
import { credsService } from 'src/creds/creds.service';
import { Logger } from '@nestjs/common';
import { NamespaceService } from 'src/namespace/namespace.service';

@Injectable()
export class PodService {
  private kc: k8s.KubeConfig;
  private k8sApi: k8s.CoreV1Api;
  private readonly logger = new Logger(
    PodService.name,
  );

  constructor(
    private _credsService: credsService,
    private _namespace: NamespaceService,
  ) {
    const res = this._credsService.loadconfig();
    this.kc = res.kc;
    this.k8sApi = res.k8sApi;
  }

  //list all the pods
  async listpods(): Promise<k8s.V1Pod[]> {
    const result =
      await this.k8sApi.listPodForAllNamespaces();
    return result.items.map(
      (pod) => pod ?? 'Unknown',
    );
  }

  //list all the pods in a specific namespace
  async listpodsbyNamespace(
    namespace: string,
  ): Promise<k8s.V1Pod[] | null> {
    try {
      const namespace_exist =
        this._namespace.getNamespace(namespace);
      if (namespace_exist == null) {
        return null;
      }
      const result =
        await this.k8sApi.listNamespacedPod({
          namespace,
        });
      return result.items.map(
        (pod) => pod ?? 'unknown',
      );
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
  ): Promise<any> {
    try {
      // Namespace existence validation
      const namespaceExist =
        await this._namespace.getNamespace(
          namespace,
        );
      if (!namespaceExist) {
        throw new HttpException(
          `Namespace ${namespace} does not exist`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Correctly call the deleteNamespacedPod method with the required object
      const result =
        await this.k8sApi.deleteNamespacedPod({
          name: podName,
          namespace: namespace,
        });
      // console.log(result.status);

      this.logger.log(
        `Pod ${podName} deleted successfully in namespace ${namespace}`,
      );

      var res = `Pod ${podName} deleted successfully in namespace ${namespace}`;

      return res; // Return the V1Status directly
    } catch (err: any) {
      console.log(3);
      console.log(err);
      // Log the entire error object for better debugging
      const errorMessage =
        err?.response?.body?.message ||
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
