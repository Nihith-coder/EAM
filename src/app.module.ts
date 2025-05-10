import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NamespaceModule } from './namespace/namespace.module';
import { CredsModule } from './creds/creds.module';


@Module({
  imports: [AuthModule, UserModule, NamespaceModule, CredsModule],
  providers: [],
  exports: [],
  controllers: [],
})
export class AppModule {}
