import ky from 'ky'
import { serverUrl } from '@/api/ApiSettings'

class AuthorApi {
    private url: string = '/authors'
    public async addAuthor(author: any): Promise<void> {
        await ky.post('addAuthor', { json: author, prefixUrl: serverUrl + this.url })
    }
}

export default new AuthorApi()
