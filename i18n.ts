const path = require('path')
import NextI18Next from 'next-i18next'

const i18n = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['it', 'ja'],
  localePath: path.resolve('./public/static/locales'),
})

export default i18n