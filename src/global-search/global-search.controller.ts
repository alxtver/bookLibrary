import { Controller, Get, Query } from "@nestjs/common";
import { GlobalSearchService } from './global-search.service';
import { Book } from "../books/entities/book.entity";
import { Author } from "../authors/entities/author.entity";

export interface SearchDto {
  books: Array<Book>;
  authors: Array<Author>
}

@Controller('global-search')
export class GlobalSearchController {
  constructor(private readonly globalSearchService: GlobalSearchService) {}

  /**
   * Найти книги или авторов по паттерну
   * @param pattern
   * @private
   */
  @Get()
  private async search(@Query('pattern') pattern: string): Promise<SearchDto> {
    return await this.globalSearchService.search(pattern)
  }

}
