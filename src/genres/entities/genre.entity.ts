import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export const Genres: { [key: string]: string } = {
    sf_etc: 'Фантастика',
    sf_fantasy: 'Фэнтези',
    sf_heroic: 'Героическая фантастика',
    sf_history: 'Историческая фантастика',
    sf_action: 'Экшн',
    sf_cyberpunk: 'Киберпанк',
    network_literature: 'Сетевая литература',
    children: 'Детская литература',
    sf_social: 'Социально-психологическая фантастика',
    sf_space: 'Космическая фантастика',
    child_sf: 'Детская фантастика',
    sf_litrpg: 'ЛитРПГ'
}

@Entity()
export class Genre {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string
}
