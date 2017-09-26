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
                    <ul>
                        <li :class="isClickBaseInfo?'': 'open'">
                            <a @click="showSubNavs">
                                <span class="icon-box"><i class="bk-icon icon-order"></i></span>
                                <span class="nav-name">订单管理</span>
                            </a>
                            <div class="flex-subnavs" :style="{display: subNavsDisplay}">
                                <a href="#/smsorder" :class="$route.path ==='/smsorder'? 'on':''" ><i></i>短信订单</a>
                                <a  :class="$route.path ==='/mailorder'? 'on':''" href="#/mailorder"><i></i>电子信函</a>
                            </div>
                        </li>
                        <li class="pureLink" :class="isClickBaseInfo?'open': ''">
                            <a href="#/baseinfo" @click="showBaseInfo">
                                <span class="icon-box"><i class="bk-icon icon-empty"></i></span>
                                <span class="nav-name">基本信息</span>
                            </a>
                        </li>
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

    export default{
        data(){
            return{
                collapsed: false,
                enterpriseUserName:'',
                enterpriseTelphone:'',
                subNavsDisplay:'none',
                isShowSubNavs:false,
                isClickBaseInfo:true,
            }
        },
        methods:{
            logout:function () {
                var _this = this;
                sessionStorage.removeItem('user');
                _this.$router.push('/login');
            },
            collapse: function() { //折叠导航栏
                this.collapsed = !this.collapsed;
                this.hideSubNavs();
            },
            showSubNavs:function () {
                if(!this.isShowSubNavs){
                    this.subNavsDisplay = 'block';
                }
                else{
                    this.subNavsDisplay = 'none';
                }
                this.isShowSubNavs = !this.isShowSubNavs;
                this.isClickBaseInfo = false;
            },
            showBaseInfo:function () {
                this.isClickBaseInfo = true;
                this.hideSubNavs();
            },
            hideSubNavs:function () {
                this.subNavsDisplay = 'none';
                this.isShowSubNavs = false;
            }

        },
        mounted(){
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
    a:hover{
        cursor:pointer
    }
</style>