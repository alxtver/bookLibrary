import { Column, JoinTable, PrimaryGeneratedColumn } from 'typeorm'
import { ManyToMany } from 'typeorm'
import { Author } from '../../authors/entities/author.entity'

export class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    added: Date

    @Column()
    realiseDate: Date

    @ManyToMany(() => Author)
    @JoinTable()
    authors: Author[]
}
