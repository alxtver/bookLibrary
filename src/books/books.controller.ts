import { Controller, Get, Query, Res } from '@nestjs/common'
import { BooksService } from './books.service'
import { Book } from './entities/book.entity'
import { Response } from 'express'

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    /**
     * Получить все книги
     */
    @Get('/getAll')
    getAll(): Promise<Array<Book>> {
        return this.booksService.getAll()
    }

    /**
     * Получить книгу по идентификатору
     * @param id
     */
    @Get('/getById')
    async getById(@Query('id') id: string): Promise<Book> {
        return await this.booksService.getById(id)
    }

    /**
     * Загрузить книгу по идентификатору
     * @param res
     * @param id
     */
    @Get('/loadBook')
    async loadBook(@Res() res: Response, @Query('id') id: string): Promise<void> {
        const stream = await this.booksService.loadBook(id)
        res.contentType('application/fb2')
        stream.pipe(res)
    }

    /**
     * Получить книги по идентификатору автора
     * @param id
     */
    @Get('/getByAuthorId')
    async getByAuthorId(@Query('id') id: string): Promise<Array<Book>> {
        return await this.booksService.getByAuthorId(id)
    }
}
