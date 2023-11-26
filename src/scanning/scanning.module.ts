import { Module } from '@nestjs/common'
import { ScanningController } from './scanning.controller'
import { ScanningService } from './scanning.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Author } from '../authors/entities/author.entity'

@Module({
    controllers: [ScanningController],
    providers: [ScanningService],
    imports: [TypeOrmModule.forFeature([Author])]
})
export class ScanningModule {}
