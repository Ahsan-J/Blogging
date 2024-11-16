import { FindOperator, FindOptionsWhere, ObjectLiteral, SelectQueryBuilder } from "typeorm";

export function applyFiltersToQueryBuilder<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, filters?: Array<FindOptionsWhere<T>>): SelectQueryBuilder<T> {

    filters?.forEach(filter => {
        Object.keys(filter).forEach(key => {
            const value = filter[key];

            if (typeof value === 'string') {
                queryBuilder.andWhere(`${key} LIKE :${key}`, { [key]: `%${value}%` });
            } else if (value instanceof FindOperator) {
                queryBuilder.andWhere(`${key} ${value}`);
            } else {
                queryBuilder.andWhere(`${key} = :${key}`, { [key]: value });
            }
        });
    });

    return queryBuilder;
}