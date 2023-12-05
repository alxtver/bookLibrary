import { Column, PrimaryGeneratedColumn, ManyToOne, Entity } from 'typeorm'
import { Book } from '../../books/entities/book.entity'

@Entity()
export class Image {
    constructor(data: string) {
        this.data = data
    }

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'mediumtext', default: null })
    data: string

    @ManyToOne(() => Book, (book: Book) => book.images)
    book: Book
}
