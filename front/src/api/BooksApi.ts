import ky from 'ky'
import { serverUrl } from '@/api/ApiSettings'
import { dataToArrayClass } from '@/api/classfactory/ClassFactory'
import { Book } from "@/components/bookcard/types"

class BooksApi {
    private url: string = '/books'
    public async getAllBooks(): Promise<Book[]> {
        const response = (await ky
            .get('getAll', { prefixUrl: `${serverUrl}${this.url}` })
            .json()) as unknown[]
        return dataToArrayClass(Book, response)
    }
}

export default new BooksApi()
