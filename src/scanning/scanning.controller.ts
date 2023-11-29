import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common'
import { ScanningService } from './scanning.service'
import { Response, Request } from 'express'

@Controller('scanning')
export class ScanningController {
    constructor(private readonly scanningService: ScanningService) {}
    @Get('/scan')
    async scan(@Req() req: Request, @Res() res: Response) {
        const path = req.query.path as string
        const data = await this.scanningService.scan(path)
        res.status(HttpStatus.OK).json(data)
    }
}
