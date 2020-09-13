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
                    <router-link :to="{name:thirdMenu.name}" v-for="(thirdMenu,key) in subMenu.children" :key="key"><el-menu-item :index="'1-1-'+key">{{thirdMenu.title}}</el-menu-item></router-link>
                </el-submenu>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>

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
                    name: 'comObject'
                },{
                    title: 'Map',
                    name: 'comObject'
                }]
            }]
        },{
            title: 'CSS',
            subMenu: [{
                title:'布局',
                children: [{
                    title: 'Grid',
                    name: 'comObject'
                },{
                    title: 'Flex',
                    name: 'comObject'
                }]
            },{
                title:'表格',
                children: [{
                    title: 'test',
                    name: 'table'
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
    top: 50px;
    bottom: 0;
    left: 0;
    z-index: 100;
}
</style>
<style>
.el-submenu .el-menu-item {
    min-width: 0 !important;
    padding: 0 auto !important;
    text-align: center !important;
}
</style>
<style>
li {
    padding: 0 !important;
}
.slider-bar ul {
    height: 100% !important;
}
</style>
