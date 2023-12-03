import type { Book } from '../../../src/books/entities/book.entity'
import ky from 'ky'
import { serverUrl } from '@/api/ApiSettings'

class BooksApi {
    private url: string = '/books'
    public async getAllBooks(): Promise<Book[]> {
        const response = ky.get('getAll', { prefixUrl: `${serverUrl}${this.url}` })
        return response.json()
    }
}

export default new BooksApi()
