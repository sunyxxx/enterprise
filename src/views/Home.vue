<template>
    <div class="h100s">
        <nav class="bk-horz-nav bk-horz-nav-min">
            <div class="bk-nav-logo fl">
                <!-- <img src="https://magicbox.bkclouds.cc/static_api/v3/components_pro/horizontal_nav1/images/logo.png"> -->
                法法社企业后台管理系统
            </div>
            <!--<ul class="ffs-breadcrumb">-->
            <!--<li class="fir"><a href="">首页</a></li>-->
            <!--<li class="sec"><a href="">二级页面</a></li>-->
            <!--<li class="last active"><a href="">三级页面</a></li>-->
            <!--</ul>-->
            <div class="bk-nav-user fr">
                <el-dropdown class="bk-nav-user fr" trigger="hover">
                    <span class="mr5">{{enterpriseUserName}}</span>
                    <img src="https://magicbox.bkclouds.cc/static_api/v3/components_pro/horizontal_nav1/images/avatar.png">
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </nav>
        <div class="bk-layout bk-layout-has-sidebar" style="height:calc(100% - 60px)">
            <div class="bk-sidebar" :class="collapsed?'slide-close':'slide-open'">
                <div class="slide-switch" @click="collapse">
                    <i class="icon bk-icon icon-dedent f14"></i>
                </div>
                <div class="nav-list">
                    <ul ref="menuCollapsed">
                        <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                            <li :class="item.paths.indexOf($route.path.split('/')[1])>-1? 'open': ''">
                                <template v-if="!item.leaf">
                                    <a @click="showMenu(index,true)">
                                            <span class="icon-box"><i class="bk-icon" :class="item.iconCls"></i></span>
                                            <span class="nav-name">{{item.name}}</span>
                                        </a>
                                    <div class="flex-subnavs" :class="'submenu-hook-'+index" :style="item.paths.indexOf($route.path)>-1?'display: block;':'display:none;'">
                                        <a v-for="child in item.children" v-if="!child.hidden" :class="$route.path==child.path?'on':''" @click="$router.push(child.path);"><i></i>{{child.name}}
                                            </a>
                                    </div>
                                </template>
                                <template v-else>
                                    <a @click="$router.push(item.children[0].path);">
                                            <span class="icon-box"><i class="bk-icon" :class="item.iconCls"></i></span><span class="nav-name">{{item.children[0].name}}</span>
                                        </a>
                                </template>
                            </li>
                        </template>
                    </ul>
                </div>
                <div class="copyright">
                    <p>Copyright &copy; 2012-2017 法法社.</p>
                    <span>All Rights Reserved.</span>
                </div>
            </div>
            <div class="page-content">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>
<script>
import '../style/css/bootstrap.min.css'
import '../style/css/bk_pro.css'
import '../style/css/iconfont.css'
import '../style/css/common.css'
import '../style/css/index.css'

export default {
    data() {
        return {
            collapsed: false,
            enterpriseUserName: '',
            enterpriseTelphone: '',
            subNavsDisplay: 'none',
            isShowSubNavs: false,
            isClickBaseInfo: true,
        }
    },
    methods: {
        logout: function() {
            var _this = this;
            sessionStorage.removeItem('user');
            _this.$router.push('/login');
        },
        collapse: function() { //折叠导航栏
            this.collapsed = !this.collapsed;
            this.hideSubNavs();
        },
        showSubNavs: function() {
            if (!this.isShowSubNavs) {
                this.subNavsDisplay = 'block';
            } else {
                this.subNavsDisplay = 'none';
            }
            this.isShowSubNavs = !this.isShowSubNavs;
            this.isClickBaseInfo = false;
        },
        showBaseInfo: function() {
            this.isClickBaseInfo = true;
            this.hideSubNavs();
        },
        hideSubNavs: function() {
            this.subNavsDisplay = 'none';
            this.isShowSubNavs = false;
        },
        showMenu(i, status) {
            var box = this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0];
            var dis = box.style.display;
            box.style.display = (dis == 'none' ? 'block' : 'none');
        },

    },
    mounted() { 
        this.$http.ajaxGet({
            url: 'enterprise/query'
        }, (res) => {
            this.$http.aop(res, (isSuccess) => {
                var enterpriseInfo = res.body.data.enterprise;
                this.enterpriseUserName = enterpriseInfo.ename;
                this.enterpriseTelphone = enterpriseInfo.telephone;

            });

        });
    }
}
</script>
<style>
a:hover {
    cursor: pointer
}
</style>