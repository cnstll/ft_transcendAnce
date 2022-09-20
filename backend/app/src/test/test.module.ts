import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  			imports: [PrismaModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
