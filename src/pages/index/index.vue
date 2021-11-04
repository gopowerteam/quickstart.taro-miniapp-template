<template>
  <div class="index">
    <div>
      <img src="" alt="" />
    </div>
    {{ msg }}
    <div class="btn p-10">
      <nut-button type="primary" @click="handleClick('text', msg2)"
        >点我</nut-button
      >
    </div>
    <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" />
  </div>
</template>

<script setup lang="ts">
import { set } from '@/shared/common'
import { ref } from 'vue'

const msg = ref('欢迎使用 NutUI3.0 开发小程序')
const msg2 = ref('你成功了')
const type = ref('text')
const show = ref(false)
const cover = ref(false)

const handleClick = (_type, _msg) => {
  set(show, true)
  set(msg2, _msg)
  set(type, _type)
  set(cover, true)
  set(show, true)
}
</script>

<script lang="ts">
export default {
  mounted() {
    this.handleClick('text2', this.msg2)
  }
}
</script>

<style lang="scss">
.index {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
