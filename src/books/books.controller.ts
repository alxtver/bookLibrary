import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common'
import { BooksService } from './books.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { Book } from './entities/book.entity'
import { Request } from 'express'

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Post()
    create(@Body() createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto)
    }

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

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
        return this.booksService.update(+id, updateBookDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.booksService.remove(+id)
    }
}
