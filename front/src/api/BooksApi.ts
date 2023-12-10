import ky from 'ky'
import { serverUrl } from '@/api/ApiSettings'
import { dataToArrayClass } from '@/api/classfactory/ClassFactory'
import { Book } from '@/components/bookcard/types'

class BooksApi {
    private url: string = '/books'
    public async getAllBooks(): Promise<Book[]> {
        const response = (await ky
            .get('getAll', { prefixUrl: `${serverUrl}${this.url}` })
            .json()) as unknown[]
        return dataToArrayClass(Book, response)
    }

    public async getBookById(id: string): Promise<Book> {
        const response = await ky.get('getById', {
            prefixUrl: `${serverUrl}${this.url}`,
            searchParams: { id }
        })
        return response.json()
    }

    public async download(id: string, fileName: string): Promise<void> {
        const response = await ky.get('loadBook', {
            prefixUrl: `${serverUrl}${this.url}`,
            searchParams: { id }
        })
        const blob = await response.blob()
        const href = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = href
        link.setAttribute('download', fileName)

        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        URL.revokeObjectURL(href)
    }
}

export default new BooksApi()
