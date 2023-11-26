import { Column, JoinTable, PrimaryGeneratedColumn } from 'typeorm'
import { ManyToMany } from 'typeorm'
import { Book } from '../../books/entities/book.entity'

export class Genre {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @ManyToMany(() => Book)
    @JoinTable()
    book: Book[]
}
