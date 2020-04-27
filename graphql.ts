
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class Recipe {
    id?: number;
    title?: string;
    description?: string;
}

export abstract class IQuery {
    abstract recipe(id: number): Recipe | Promise<Recipe>;

    abstract recipes(): Recipe[] | Promise<Recipe[]>;
}

export abstract class IMutation {
    abstract createRecipe(title?: string, description?: string): Recipe | Promise<Recipe>;
}
