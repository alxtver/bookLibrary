import * as process from 'process'

export const config = () => ({
    port: parseInt(process.env.PORT as string, 10) || 8080,
    database: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD
    }
})
