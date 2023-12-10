export class Book {
    /** Идентификатор */
    public id!: string
    /** Название книги */
    public title!: string
        /** Описание книги */
    public annotation!: string
    /** Дата добавления в библиотеку */
    public created!: Date
    /** Дата издания */
    public realiseDate!: Date
    /** Авторы */
    public authors!: Author[]
    /** Жанры */
    public genres!: Genre[]
    /** Наименование файла */
    public fileName!: string
    /** Путь до файла */
    public path!: string
}

export class Author {
    /** Идентификатор */
    public id!: string
    /** Имя  */
    public firstName!: string
    /** Фамилия */
    public lastName!: string
}

export class Genre {
    public id!: string

    public name!: string
}
