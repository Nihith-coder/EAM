import { Module } from '@nestjs/common';
import { credsService } from './creds.service';


@Module({
  providers: [credsService],
  exports: [credsService],
})

export class CredsModule {}
