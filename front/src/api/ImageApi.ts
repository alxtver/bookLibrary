import ky from 'ky'
import { serverUrl } from '../api/ApiSettings'
import type { Image } from '../../../src/images/entities/image.entity'

class ImageApi {
    private url: string = '/images'

    /**
     * Найти изображения по идентификатору книги
     * @param bookId
     */
    public async getImagesByBookId(bookId: string): Promise<Array<Image>> {
        const response = await ky.get('getByBookId', {
            prefixUrl: `${serverUrl}${this.url}`,
            searchParams: { bookId }
        })
        return response.json()
    }
}

export default new ImageApi()
