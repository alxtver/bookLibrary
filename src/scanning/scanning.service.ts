import { Injectable } from '@nestjs/common'
import { readdir } from 'node:fs/promises'
import * as fs from 'fs'
import { CreateAuthorDto } from '../authors/dto/create-author.dto'
import { CreateGenreDto } from '../genres/dto/create-genre.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Author } from '../authors/entities/author.entity'
import { Repository } from 'typeorm'
import { Genre, Genres } from '../genres/entities/genre.entity'
import { Book } from '../books/entities/book.entity'
import { WebsocketGateway } from '../websocket/websocket.gateway'
import { XMLParser } from 'fast-xml-parser'
import { Image } from '../images/entities/image.entity'

export interface BookInfo {
    title: string
    annotation: string
    path: string
    authors: Array<CreateAuthorDto>
    genres: Array<CreateGenreDto>
    realiseDate: Date
    image: string
}

@Injectable()
export class ScanningService {
    constructor(
        @InjectRepository(Author)
        private authorsRepository: Repository<Author>,

        @InjectRepository(Genre)
        private genresRepository: Repository<Genre>,

        @InjectRepository(Book)
        private booksRepository: Repository<Book>,

        @InjectRepository(Image)
        private imageRepository: Repository<Image>,

        private webSocket: WebsocketGateway
    ) {}

    public async scan(path: string): Promise<Array<fs.Dirent>> {
        this.webSocket.sendStart()
        // чтение файлов
        const files = await this.readFiles(path)
        // парсинг файлов
        await this.parseFiles(files)

        this.webSocket.sendEnd()
        return files
    }

    /**
     * Чтение файлов из папки
     * @param path
     * @private
     */
    private async readFiles(path: string): Promise<Array<fs.Dirent>> {
        this.webSocket.sendMessage('Поиск книг')
        const readDir = await readdir(path, { recursive: true, withFileTypes: true })
        const books = readDir.filter(
            (item: fs.Dirent): boolean => item.isFile() && item.name.includes('.fb2')
        )
        this.webSocket.sendMessage(`Книг найдено - ${books.length}`)
        return books
    }

    /**
     * Парсинг файлов
     * @param files
     * @private
     */
    private async parseFiles(files: Array<fs.Dirent>): Promise<void> {
        const numberOfFiles = files.length
        let index = 0
        for (const file of files) {
            index++
            const bookInfo = await this.readInfo([file.path, file.name].join('\\'))
            if (!bookInfo || !bookInfo.authors) {
                continue
            }
            this.webSocket.sendMessage(`Обрабатывается книга - ${bookInfo.title}`)

            this.webSocket.sendProgress({ count: numberOfFiles, current: index })
            const authors = await this.createAuthors(bookInfo)
            const genres = await this.createGenres(bookInfo)
            const images = await this.createImages(bookInfo)
            await this.createBook(bookInfo, authors, genres, images, file.path, file.name)
        }
    }

    /**
     * Чтение информации из файла
     * @param filePath
     * @private
     */
    private async readInfo(filePath: string): Promise<BookInfo | undefined> {
        const parser = new XMLParser()

        const bookData = parser.parse(fs.readFileSync(filePath))
        const titleInfo = bookData.FictionBook.description['title-info']
        const binary = bookData.FictionBook.binary
        return {
            title: this.getBookTitle(titleInfo),
            annotation: this.getBookAnnotation(titleInfo),
            path: filePath,
            authors: this.getAuthors(titleInfo),
            genres: this.getGenres(titleInfo),
            realiseDate: this.getRealiseDate(titleInfo),
            image: this.getImage(binary)
        }
    }

    /**
     * Получить заголовок книги
     * @param titleInfo
     * @private
     */
    private getBookTitle(titleInfo: any): string {
        return titleInfo['book-title']
    }

    /**
     * Получить изображение
     * @private
     * @param binary
     */
    private getImage(binary: string | Array<string>): string {
        if (Array.isArray(binary)) {
            binary = binary[0]
        }
        return `data:image/png;base64,${binary}`
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
        if (Array.isArray(titleInfo.annotation.p)) {
            return titleInfo.annotation.p
                .map((item: any): string => (typeof item === 'string' ? item : ''))
                .join('\n')
        }
        return titleInfo.annotation.p || ''
    }

    /**
     * Получить жанры книги
     * @private
     */
    private getGenres(titleInfo: any): CreateGenreDto[] {
        if (!titleInfo.genre) {
            return []
        }
        if (typeof titleInfo.genre === 'string') {
            return [{ name: Genres[titleInfo.genre] ? Genres[titleInfo.genre] : titleInfo.genre }]
        }
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
        if (!titleInfo.author) {
            return []
        }
        if (Array.isArray(titleInfo.author)) {
            return titleInfo.author.map(
                (item: { 'first-name': string; 'last-name': string }): CreateAuthorDto => {
                    const firstName = item['first-name'] || ''
                    const lastName = item['last-name'] || ''
                    return {
                        firstName,
                        lastName
                    }
                }
            )
        }
        return [
            {
                firstName: titleInfo.author['first-name'] || '',
                lastName: titleInfo.author['last-name'] || ''
            }
        ]
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
        if (titleInfo.date) {
            date = new Date(titleInfo.date)
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
     * @param images
     * @param path
     * @param fileName
     * @private
     */
    private async createBook(
        bookInfo: BookInfo,
        authors: Array<CreateAuthorDto & Author>,
        genres: Array<Genre>,
        images: Array<Image>,
        path: string,
        fileName: string
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
                genres,
                images,
                path: `${path}\\${fileName}`,
                fileName
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

    private async createImages(bookInfo: BookInfo): Promise<Image[]> {
        const image = new Image(bookInfo.image)
        await this.imageRepository.save(image)
        return [image]
    }
}
