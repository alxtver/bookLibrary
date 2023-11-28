import { Injectable } from '@nestjs/common'
import { readdir } from 'node:fs/promises'
import * as fs from 'fs'
import { Parser } from 'xml2js'
import { CreateAuthorDto } from '../authors/dto/create-author.dto'
import { CreateGenreDto } from '../genres/dto/create-genre.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Author } from '../authors/entities/author.entity'
import { Repository } from 'typeorm'
import { Genre, Genres } from '../genres/entities/genre.entity'
import { Book } from '../books/entities/book.entity'

export interface BookInfo {
    title: string
    annotation: string
    path: string
    authors: Array<CreateAuthorDto>
    genres: Array<CreateGenreDto>
    realiseDate: Date
}

@Injectable()
export class ScanningService {
    constructor(
        @InjectRepository(Author)
        private authorsRepository: Repository<Author>,

        @InjectRepository(Genre)
        private genresRepository: Repository<Genre>,

        @InjectRepository(Book)
        private booksRepository: Repository<Book>
    ) {}

    public async scan(): Promise<Array<string>> {
        const files = await this.readFiles()
        for (const file of files) {
            const bookInfo = await this.readInfo([file.path, file.name].join('\\'))
            if (!bookInfo) {
                continue
            }
            console.log('read book ->>>', bookInfo.title)
            const authors = await this.createAuthors(bookInfo)
            const genres = await this.createGenres(bookInfo)
            await this.createBook(bookInfo, authors, genres)
        }
        return files
    }

    private async readFiles(): Promise<any> {
        const dir = '\\\\192.168.1.99\\downloads\\books'
        console.log('Начали читать файлы')
        const readDir = await readdir(dir, { recursive: true, withFileTypes: true })
        console.log('end reed files')
        return readDir.filter(
            (item: fs.Dirent): boolean => item.isFile() && item.name.includes('.fb2')
        )
    }

    /**
     * Чтение информации из файла
     * @param filePath
     * @param callback
     * @private
     */
    private async readInfo(filePath: string): Promise<BookInfo | undefined> {
        const parser = new Parser()
        const data = fs.readFileSync(filePath)
        try {
            const bookData = await parser.parseStringPromise(data)
            const titleInfo = bookData.FictionBook.description[0]['title-info'][0]
            return {
                title: this.getBookTitle(titleInfo),
                annotation: this.getBookAnnotation(titleInfo),
                path: filePath,
                authors: this.getAuthors(titleInfo),
                genres: this.getGenres(titleInfo),
                realiseDate: this.getRealiseDate(titleInfo)
            }
        } catch (e) {
            return
        }
    }

    /**
     * Получить заголовок книги
     * @param titleInfo
     * @private
     */
    private getBookTitle(titleInfo: any): string {
        return titleInfo['book-title'][0]
    }

    /**
     * Получить аннотацию книги
     * @param titleInfo
     * @private
     */
    private getBookAnnotation(titleInfo: any): string {
        if (!titleInfo.annotation) {
            return ''
        }
        if (Array.isArray(titleInfo.annotation[0])) {
            return titleInfo.annotation[0][0]
        }
        if (typeof titleInfo.annotation[0] === 'object' && titleInfo.annotation[0].p) {
            return titleInfo.annotation[0].p.join('\n')
        }
        return titleInfo.annotation[0]
    }

    /**
     * Получить жанры книги
     * @private
     */
    private getGenres(titleInfo: any): CreateGenreDto[] {
        return titleInfo.genre.map((item: string): CreateGenreDto => {
            const value = item.trim()
            return {
                name: Genres[value] ? Genres[value] : value
            }
        })
    }

    /**
     * Получить авторов книги
     * @private
     */
    private getAuthors(titleInfo: any): CreateAuthorDto[] {
        return titleInfo.author.map(
            (item: { 'first-name': string; 'last-name': string }): CreateAuthorDto => {
                const firstName = Array.isArray(item['first-name']) ? item['first-name'][0] : ''
                const lastName = Array.isArray(item['last-name']) ? item['last-name'][0] : ''
                return {
                    firstName,
                    lastName
                }
            }
        )
    }

    /**
     * Создание авторов
     * @param bookInfo
     * @private
     */
    private async createAuthors(bookInfo: BookInfo): Promise<Array<CreateAuthorDto & Author>> {
        const authorsEntity: Array<CreateAuthorDto & Author> = []
        for (const author of bookInfo.authors) {
            const authorFromBase = await this.authorsRepository.findOne({
                where: author
            })
            if (authorFromBase) {
                authorsEntity.push(authorFromBase)
                continue
            }
            authorsEntity.push(await this.authorsRepository.save(author))
        }
        return authorsEntity
    }

    /**
     * Создание жанров
     * @param bookInfo
     * @private
     */
    private async createGenres(bookInfo: BookInfo): Promise<any> {
        const genresEntity: Array<CreateGenreDto & Genre> = []
        for (const genre of bookInfo.genres) {
            const genreFromBase = await this.genresRepository.findOne({ where: genre })
            if (
                genreFromBase &&
                !genresEntity.some(
                    (item: CreateGenreDto & Genre): boolean => item.id === genreFromBase.id
                )
            ) {
                genresEntity.push(genreFromBase)
                continue
            }
            genresEntity.push(await this.genresRepository.save(genre))
        }
        return genresEntity
    }

    /**
     * Получить дату выпуска книги
     * @param titleInfo
     * @private
     */
    private getRealiseDate(titleInfo: any): Date {
        let date: Date = new Date()
        if (titleInfo.date && titleInfo.date[0]) {
            if (typeof titleInfo.date[0] === 'string') {
                date = new Date(titleInfo.date[0])
            }
            if (titleInfo.date[0]['$'].value) {
                date = new Date(titleInfo.date[0]['$'].value)
            }
            if (titleInfo.date[0]['_']) {
                date = new Date(titleInfo.date[0]['_'])
            }
        }
        if (date.toString() === 'Invalid Date') {
            date = new Date()
        }
        return date
    }

    /**
     * Создание книги
     * @param bookInfo
     * @param authors
     * @param genres
     * @private
     */
    private async createBook(
        bookInfo: BookInfo,
        authors: Array<CreateAuthorDto & Author>,
        genres: any
    ): Promise<void> {
        const findBook = await this.booksRepository.findOne({
            where: { title: bookInfo.title, authors }
        })
        if (findBook) {
            return
        }
        try {
            await this.booksRepository.save({
                title: bookInfo.title,
                annotation: bookInfo.annotation,
                realiseDate: bookInfo.realiseDate,
                authors,
                genres
            })
        } catch (e) {
            const b = {
                title: bookInfo.title,
                annotation: bookInfo.annotation,
                realiseDate: bookInfo.realiseDate,
                authors,
                genres
            }
            console.error(e, b)
        }
    }
}
