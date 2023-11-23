import { Controller, Get, HttpStatus, Res } from '@nestjs/common'
import { ScanningService } from './scanning.service'
import { Response } from 'express'

@Controller('scanning')
export class ScanningController {
    constructor(private readonly scanningService: ScanningService) {}
    @Get('/scan')
    async scan(@Res() res: Response) {
        await this.scanningService.scan()
        res.status(HttpStatus.OK)
    }
}
