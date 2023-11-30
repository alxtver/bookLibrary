import { DataSource } from 'typeorm'
import * as process from 'process'

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'mysql',
                host: process.env.DATABASE_HOST,
                port: 3306,
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: 'book_library',
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true
            })

            return dataSource.initialize()
        }
    }
]
