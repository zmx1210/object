<template>
    <div class="nav">
        <el-row>
            <el-col :span="12" class="nav-left">
                <div class="title">这是标题</div>
            </el-col>
            <el-col :span="12" class="nav-right">
                <el-dropdown trigger="click">
                    <span class="el-dropdownright-link">
                        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-circle-plus-outline">螺蛳粉</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-check">双皮奶</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-circle-check">蚵仔煎</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
    </div>
</template>

<script>

export default {
  name: 'nav-header',
   data() {
    return {
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.nav {
    width: 100%;
    height: 50px;
    background: #545c60;

    .nav-left {
        line-height: 50px;
        padding: 0px 10px;
    }

    .nav-right {
        text-align: right;
        line-height: 50px;
        padding: 0px 10px;
    }
}
</style>
