import { Injectable } from '@nestjs/common'
import { readdir } from 'node:fs/promises'
import * as fs from 'fs'
import { Parser } from 'xml2js'

@Injectable()
export class ScanningService {
    public async scan(): Promise<Array<string>> {
        const files = await this.readFiles()
        files.forEach((file: fs.Dirent): void => {
            this.readInfo([file.path, file.name].join('\\'), (result): void => {
                for (const [key, value] of Object.entries(result)) {
                    console.log({ key, value })
                }
            })
        })
        return files
    }

    /**
     * Чтение файлов
     * @private
     */
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
     * @private
     */
    private async readInfo(filePath: string, callback: (result: any) => void): Promise<any> {
        const parser = new Parser()
        fs.readFile(filePath, (err: Error, data: Buffer): void => {
            parser.parseString(data, (err: Error, result: any): void => {
                callback(result.FictionBook.description[0])
            })
        })
    }
}
