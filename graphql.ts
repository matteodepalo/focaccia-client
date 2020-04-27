
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface Recipe {
    id: number;
    title?: string;
    description?: string;
}

export interface IQuery {
    recipe(id: number): Recipe | Promise<Recipe>;
    recipes(): Recipe[] | Promise<Recipe[]>;
}

export interface IMutation {
    createRecipe(title?: string, description?: string): Recipe | Promise<Recipe>;
}
