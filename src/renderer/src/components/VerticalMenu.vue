<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#fff"
    class="vertical-menu"
    default-active="2"
    text-color="#545c64"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon><cpu /></el-icon>
        <span>Apps</span>
      </template>
      <el-menu-item-group title="Group One">
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title>item four</template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <RouterLink to="{name: 'dashboard'}">dashboard</RouterLink>
    </el-menu-item>
    <!--    <el-menu-item index="3" disabled>-->
    <!--      <el-icon><document /></el-icon>-->
    <!--      <span>Navigator Three</span>-->
    <!--    </el-menu-item>-->
    <el-menu-item index="4">
      <el-icon><setting /></el-icon>
      <span>Paramètres</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { Document, Menu as IconMenu, Location, Setting, Cpu } from '@element-plus/icons-vue'

export default {
  name: 'VerticalMenu',
  components: {
    Cpu,
    Document,
    IconMenu,
    Location,
    Setting
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
