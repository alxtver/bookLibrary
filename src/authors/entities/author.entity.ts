import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Author {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    firstName: string

    @Column()
    lastName: string
}
