<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view ref="swiperOptions" :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },

  mounted() {
    window.onresize = () => {
      let fHeight1 = 0
      this.$refs.swiperOptions.$children.map((item) => {
        const arr = [...item.$el.classList]
        if (!arr.some(val => val === 'el-table')) {
          fHeight1 += item.$el.clientHeight
        }
      })
      this.$store.dispatch('settings/changeTableHeight', fHeight1)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  padding: 10px;
  min-height: calc(100vh - 100px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #eff1f4;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh);
  }

  .fixed-header+.app-main {
    padding-top: 94px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
