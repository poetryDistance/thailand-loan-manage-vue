// translate router.meta.title, 在面包屑侧边栏标签视图中使用
export function generateTitle(title) {
  let hasKey = null
  if (title.split(' ')[0] === 'userDetails') {
    hasKey = this.$te('route.userDetails')
  } else if (title.split(' ')[0] === 'taskFollowUp') {
    hasKey = this.$te('route.taskFollowUp')
  } else {
    hasKey = this.$te('route.' + title)
  }
  if (hasKey) {
    // $t: 此方法来自vue-i18n，注入 @/lang/index.js
    let translatedTitle = null
    if (title.split('-')[0] === 'userDetails ') {
      translatedTitle = this.$t('route.userDetails') + ' -' + title.split('-')[1]
    } else if (title.split('-')[0] === 'taskFollowUp ') {
      translatedTitle = this.$t('route.taskFollowUp') + ' -' + title.split('-')[1]
    } else {
      translatedTitle = this.$t('route.' + title)
    }

    return translatedTitle
  }
  return title
}
