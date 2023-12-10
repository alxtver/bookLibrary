import { Module } from '@nestjs/common';
import { GlobalSearchService } from './global-search.service';
import { GlobalSearchController } from './global-search.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Author } from "../authors/entities/author.entity";
import { Book } from "../books/entities/book.entity";

@Module({
  controllers: [GlobalSearchController],
  providers: [GlobalSearchService],
  imports: [TypeOrmModule.forFeature([Author, Book])]
})
export class GlobalSearchModule {}
