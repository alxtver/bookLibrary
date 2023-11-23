import ky from 'ky'

class AuthorApi {
    private prefix = 'http://localhost:3000/authors'
    public async addAuthor(author: any): Promise<void> {
        await ky.post('addAuthor', { json: author, prefixUrl: this.prefix })
    }
}

export default new AuthorApi()
