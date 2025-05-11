import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NamespaceModule } from './namespace/namespace.module';
import { CredsModule } from './creds/creds.module';
import { PodModule } from './pod/pod.module';


@Module({
  imports: [AuthModule, UserModule, NamespaceModule, CredsModule, PodModule],
  providers: [],
  exports: [],
  controllers: [],
})
export class AppModule {}
