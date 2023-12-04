import { plainToInstance } from 'class-transformer';

export declare type ClassConstructor<T> = {
    new (...args: any[]): T;
};

/**
 * Трансформировать данные с сервера в список POJO объектов
 * @param className класс TS в который происходит трансформация
 * @param data трансформируемые данные
 * @returns список TS объектов
 */
export function dataToArrayClass<T, V>(className: ClassConstructor<T>, data: V[]): T[] {
    const result = plainToInstance(className, data);
    if (Array.isArray(result)) {
        return result;
    }
    return [result];
}

/**
 * Трансформирует данные с сервера в POJO объект
 * @param className класс TS в который происходит трансформация
 * @param data трансформируемые данные
 * @returns TS объект
 */
export function dataToClass<T, V>(className: ClassConstructor<T>, data: V[]): T {
    const result = plainToInstance(className, data);
    if (Array.isArray(result)) {
        return result[0];
    }
    return result;
}
