import NextI18Next, { TFunction } from "next-i18next"

export interface Translatable {
  t: TFunction,
  i18n: NextI18Next['i18n']
}