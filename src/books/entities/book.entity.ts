import { Column, CreateDateColumn, Entity, JoinTable, PrimaryGeneratedColumn } from 'typeorm'
import { ManyToMany, OneToMany } from 'typeorm'
import { Author } from '../../authors/entities/author.entity'
import { Genre } from '../../genres/entities/genre.entity'
import { Image } from '../../images/entities/image.entity'

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

    @OneToMany(() => Image, (image) => image.book)
    images: Array<Image>

    @ManyToMany(() => Author)
    @JoinTable()
    authors: Array<Author>

    @ManyToMany(() => Genre)
    @JoinTable()
    genres: Array<Genre>
}
