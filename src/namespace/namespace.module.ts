import { Module } from '@nestjs/common';
import { NamespaceController } from './namespace.controller';
import { NamespaceService } from './namespace.service';
import { CredsModule } from 'src/creds/creds.module';

@Module({
  imports: [CredsModule],
  controllers: [NamespaceController],
  providers: [NamespaceService],
  exports: [NamespaceModule]
})
export class NamespaceModule {}
