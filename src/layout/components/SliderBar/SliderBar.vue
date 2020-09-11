<template>
    <div class="slider-bar">
        
        <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu v-for="(firstMenu,key) in menu" :key="key" :index="key+1+''">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{firstMenu.title}}</span>
                </template>
                <el-submenu :index="'1-'+key" v-for="(subMenu,key) in firstMenu.subMenu" :key="key">
                    <template slot="title">{{subMenu.title}}</template>
                    <router-link :to="thirdMenu.url" :index="'1-1-'+key" v-for="(thirdMenu,key) in subMenu.children" :key="key">{{thirdMenu.title}}</router-link>
                </el-submenu>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
import comObject from '@/common/js/dataType/Object'

export default {
  name: 'sliderBar',
   data() {
    return {
        isCollapse: true,
        menu: [{
            title: 'JS',
            subMenu: [{
                title:'数据类型',
                children: [{
                    title: 'Object',
                    url: 'JS/comObject'
                },{
                    title: 'Map',
                    url: comObject
                }]
            }]
        }],
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
  }
}
</script>
<style lang="scss" scoped>
.slider-bar {
    width: 10%;
    position: absolute;
    left: 0;
    z-index: 100;
}
</style>
