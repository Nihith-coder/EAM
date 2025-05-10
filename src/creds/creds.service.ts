import { Injectable } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';

@Injectable({})
export class credsService {
  loadconfig(): { kc: k8s.KubeConfig; k8sApi: k8s.CoreV1Api } {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault(); // or loadFromCluster()

    // Skip TLS verification if needed
    const kubeConfig = kc.getContexts();
    if (kubeConfig) {
      console.log(kubeConfig[0]);
    }

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    return { kc, k8sApi};
  }

}