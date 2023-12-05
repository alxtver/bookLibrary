export class Book {
    public id!: string

    public title!: string

    public annotation!: string

    public created!: Date

    public realiseDate!: Date

    public authors!: Author[]

    public genres!: Genre[]
}

export class Author {
    public id!: string

    public firstName!: string

    public lastName!: string
}

export class Genre {
    public id!: string

    public name!: string
}
