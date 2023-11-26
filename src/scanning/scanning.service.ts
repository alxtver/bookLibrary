import { Injectable } from '@nestjs/common'
import { readdir } from 'node:fs/promises'
import * as fs from 'fs'
import { Parser } from 'xml2js'
import { CreateAuthorDto } from '../authors/dto/create-author.dto'
import { CreateGenreDto } from '../genres/dto/create-genre.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Author } from '../authors/entities/author.entity'
import { Repository } from 'typeorm'

export interface BookInfo {
    title: string
    annotation: string
    path: string
    authors: Array<CreateAuthorDto>
    genres: Array<CreateGenreDto>
}

@Injectable()
export class ScanningService {
    constructor(
        @InjectRepository(Author)
        private authorsRepository: Repository<Author>
    ) {}

    public async scan(): Promise<Array<string>> {
        const files = await this.readFiles()
        files.forEach((file: fs.Dirent): void => {
            this.readInfo([file.path, file.name].join('\\'), (bookInfo: BookInfo): void => {
                this.createAuthors(bookInfo)
            })
        })
        return files
    }

    private async readFiles(): Promise<any> {
        const dir = '\\\\192.168.1.99\\downloads\\test'
        const readDir = await readdir(dir, { recursive: true, withFileTypes: true })
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
    private async readInfo(filePath: string, callback: (result: any) => void): Promise<any> {
        const parser = new Parser()
        fs.readFile(filePath, (err: Error, data: Buffer): void => {
            parser.parseString(data, (err: Error, result: any): void => {
                const titleInfo = result.FictionBook.description[0]['title-info'][0]
                const bookInfo: BookInfo = {
                    title: this.getBookTitle(titleInfo),
                    annotation: this.getBookAnnotation(titleInfo),
                    path: filePath,
                    authors: this.getAuthors(titleInfo),
                    genres: this.getGenres(titleInfo)
                }
                callback(bookInfo)
            })
        })
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
            return {
                name: item
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
    private async createAuthors(bookInfo: BookInfo): Promise<void> {
        for (const author of bookInfo.authors) {
            const authorFromBase = await this.authorsRepository.findOne({
                where: author
            })
            if (authorFromBase) {
                continue
            }
            await this.authorsRepository.save(author)
        }
    }
}
