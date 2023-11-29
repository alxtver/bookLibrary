import { Column, CreateDateColumn, Entity, JoinTable, PrimaryGeneratedColumn } from 'typeorm'
import { ManyToMany } from 'typeorm'
import { Author } from '../../authors/entities/author.entity'
import { Genre } from '../../genres/entities/genre.entity'

@Entity()
export class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column('mediumtext')
    annotation: string

    @CreateDateColumn()
    created: Date

    @Column()
    realiseDate: Date

    @ManyToMany(() => Author)
    @JoinTable()
    authors: Author[]

    @ManyToMany(() => Genre)
    @JoinTable()
    genres: Genre[]
}
