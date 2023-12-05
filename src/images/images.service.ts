import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Image } from './entities/image.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image)
        private imageRepository: Repository<Image>
    ) {}

    /**
     * Найти изображения по идентификатору книги
     * @param bookId
     */
    async getByBookId(bookId: string) {
        return await this.imageRepository.find({
            where: {
                book: { id: bookId }
            }
        })
    }
}
