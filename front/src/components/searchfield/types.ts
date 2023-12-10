import { type Author, Book } from '@/components/bookcard/types'

export interface SearchDto {
    authors: Array<Author>
    books: Array<Book>
}
