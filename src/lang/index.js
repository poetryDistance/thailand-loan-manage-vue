import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { sessionData } from '@/utils/local'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import elementEsLocale from 'element-ui/lib/locale/lang/es'// element-ui lang
import elementThLocale from 'element-ui/lib/locale/lang/th'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'
import esLocale from './es'
import thLocale from './th'
Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
  es: {
    ...esLocale,
    ...elementEsLocale
  },
  th: {
    ...thLocale,
    ...elementThLocale
  }
}
export function getLanguage() {
  const chooseLanguage = sessionData('get', 'language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}

const i18n = new VueI18n({
  // set locale
  // options: en | zh
  locale: getLanguage(),
  // set locale messages
  messages
})

export default i18n
