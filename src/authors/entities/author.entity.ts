import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Author {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    fullName: string
}
