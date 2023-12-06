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
}

export default new BooksApi()
