import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { config } from './config/config';
import { AuthorsModule } from './authors/authors.module';
import { ScanningService } from './scanning/scanning.service';
import { ScanningController } from './scanning/scanning.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    DatabaseModule,
    AuthorsModule,
  ],
  controllers: [AppController, ScanningController],
  providers: [AppService, ScanningService],
})
export class AppModule {}
