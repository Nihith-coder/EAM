/* eslint-disable prettier/prettier */
import {
  Injectable,
  Logger,
} from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';
import { credsService } from 'src/creds/creds.service';

@Injectable({})
export class NamespaceService {
  private kc: k8s.KubeConfig;
  private k8sApi: k8s.CoreV1Api;
  private readonly logger = new Logger(
    NamespaceService.name,
  );

  constructor(
    private readonly _cred: credsService,
  ) {
    const { kc, k8sApi } =
      this._cred.loadconfig();
    this.kc = kc;
    this.k8sApi = k8sApi;
  }

  // List all the Namespaces
  async listingnamespace(): Promise<
    k8s.V1Namespace[]
  > {
    const res = await this.k8sApi.listNamespace();
    return res.items.map((ns) => ns ?? 'unknown');
  }

  // Get the specified namespace
  async getNamespace(
    name: string,
  ): Promise<k8s.V1Namespace | null> {
    try {
      const res = await this.k8sApi.readNamespace(
        { name },
      );
      return res;
    } catch (err) {
      this.logger.error(
        `Namespace ${name} not found`,
        err,
      );
      return null;
    }
  }

  //watch for changes in the real time in Namespace

  //create a new namespace
  async createNameSpace(
    name: string,
    labels: Record<string, string> = {},
  ): Promise<k8s.V1Namespace | null> {
    const ns: k8s.CoreV1ApiCreateNamespaceRequest =
      {
        body: {
          metadata: {
            name,
            labels,
          },
        },
      };
    try {
      const res =
        await this.k8sApi.createNamespace(ns);
      return res;
    } catch (err) {
      this.logger.error(
        `Namespace ${name} not created`,
        err,
      );
      return null;
    }
  }

  //update a namespace metadata

  //patch the namespace

  // delete the namespace
  async deleteNamespace(
    name: string,
  ): Promise<k8s.V1Status | null> {
    try {
      // Optional: Check if the namespace exists before attempting to delete
      const existingNamespace =
        await this.k8sApi.readNamespace({ name });
      if (!existingNamespace) {
        this.logger.warn(
          `Namespace ${name} does not exist`,
        );
        return null;
      }

      const result =
        await this.k8sApi.deleteNamespace(
          { name },
        );
      this.logger.log(
        `Namespace ${name} deleted successfully`,
      );
      return result; // Access the actual status object
    } catch (err) {
      this.logger.error(
        `Failed to delete namespace ${name}`,
        err,
      );
      return null; // Optionally, return more error details
    }
  }


    // delete the collection namespace
}