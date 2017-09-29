<template>
    <section>

        <div class="info">
            <div class="cont">
                <h5>账号信息</h5>
                <!--<el-form label-width="80px">-->
                    <!--<el-form-item label="账号：">-->
                        <!--<input style="width: 200px;border-style:none" type="text"  class="bk-form-input" name="" placeholder="" :value="enterpriseTelphone" readonly><span class="hint">如果更换手机，请联系市场经理修改</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="密码：" style="margin-top: -20px">-->
                        <!--<a class="bk-text-button bk-info ml10" title="修改密码" @click="showModifyPwdDialog">修改密码</a>-->
                    <!--</el-form-item>-->

                <!--</el-form>-->
                <form class="bk-form" id="validate_form" method="POST" action="javascript:;">
                    <div class="bk-form-item">
                        <label class="bk-label">账号：</label>
                        <div class="bk-form-content">
                            <input style="width: 200px;" type="text" class="bk-form-input" name="" placeholder="" :value="enterpriseTelphone" readonly><span class="hint">如果更换手机，请联系市场经理修改</span>
                        </div>
                    </div>
                    <div class="bk-form-item mt5">
                        <label class="bk-label">密码：</label>
                        <div class="bk-form-content">
                            <a class="bk-text-button bk-info ml10" title="修改密码" @click="showModifyPwdDialog">修改密码</a>
                            <!--<a data-toggle="modal" data-target="#myModal" class="bk-text-button bk-info ml10" title="修改密码">修改密码</a>-->
                        </div>
                    </div>
                </form>

            </div>
            <!--<div class="cont">-->
                <!--<h5>结算信息</h5>-->
            <!---->
                <!--<form class="bk-form" id="validate_form" method="POST" action="javascript:;">-->
                    <!--<div class="bk-form-item">-->
                        <!--<label class="bk-label">短信剩余次数：</label>-->
                        <!--<div class="bk-form-content">-->
                            <!--<input type="text" style="width: 200px;border-style:none"  class="bk-form-input" name="" placeholder="" value="敬请期待" readonly>-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<div class="bk-form-item mt0">-->
                        <!--<label class="bk-label">信函剩余次数：</label>-->
                        <!--<div class="bk-form-content">-->
                            <!--<input type="text" style="width: 200px;border-style:none" class="bk-form-input" name="" placeholder="" value="敬请期待" readonly>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</form>-->

            <!--</div>-->
        </div>
        <el-dialog title="修改密码" v-model="isShowModifyPwdDialog" :close-on-click-modal="false">

            <div class="modal-body change-psw-modal">

                <div class="verification">
                    <form class="bk-form">
                        <div class="bk-form-item">
                            <label class="bk-label">你的账号手机为：</label>
                            <div class="bk-form-content">
                                <!-- <input type="text" class="bk-form-input" name="" placeholder="" value="13634340013" readonly> -->
                                <span class="bk-label-text">{{enterpriseTelphone}}</span>
                            </div>
                        </div>
                        <div class="bk-form-item">
                            <label class="bk-label">验证码：</label>
                            <div class="bk-form-content">
                                <input type="text" class="bk-form-input code-input" name="" placeholder="请输入您收到的验证码" v-model="acctForm.smsVerifyCode">
                                <button type="button" class="btn btn-default code-btn" @click="onClickSendSms">{{verifyCodeBtnText}}</button>

                            </div>
                        </div>
                    </form>
                </div>
                <div class="change-psw">
                    <form class="bk-form">
                        <div class="bk-form-item">
                            <label class="bk-label">请输入你的新密码：</label>
                            <div class="bk-form-content">
                                <input type="password" class="bk-form-input psw-input" name="" v-model="pwdForm.newPwd">
                            </div>
                        </div>
                        <div class="bk-form-item">
                            <label class="bk-label">请重复输入新密码：</label>
                            <div class="bk-form-content">
                                <input type="password" class="bk-form-input psw-input" name="" v-model="pwdForm.repeatNewPwd">
                            </div>
                            <div class="bk-form-content err" v-show="isShowTip">
                                <span class="bk-label-text">两次密码输入不匹配，请重新输入</span>
                            </div>
                        </div>
                        <div class="bk-form-item">
                            <div class="bk-form-content">
                                <a class="bk-button bk-primary" title="确定修改" @click="onClickModifyPwd">确定修改</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </el-dialog>

    </section>
</template>
<script>
    import '../style/css/bootstrap.min.css'
    import '../style/css/bk_pro.css'
    import '../style/css/iconfont.css'
    import '../style/css/common.css'
    import '../style/css/index.css'
    import { Message } from 'element-ui'
    import { md5 } from '../utils/util_main'


    export default{

        data(){
             return{
                 enterpriseTelphone:'',
                 isShowModifyPwdDialog:false,

                 isShowModifyPwd:true,
                 isShowTip:false,

                 acctForm:{
                     smsVerifyCode:'',
                 },
                 acctFormRules:{
                     acctPhone:[
                         {
                             required: true,
                             message: '请输入手机号',
                             trigger: 'blur'
                         },
                         {
                             type: 'string',
                             pattern: /^\d{11}$/,
                             message: '请输入正确的手机号码',
                             trigger: 'blur,change'
                         }
                     ],
                     smsVerifyCode:[
                         {
                             required: true,
                             message: '请输入短信验证码',
                             trigger: 'blur'
                         },
                         {
                             type: 'string',
                             pattern: /^\w{6}$/,
                             message: '请输入6位验证码',
                             trigger: 'blur,change'
                         }
                     ]

                 },
                 pwdForm:{
                     newPwd:'',
                     repeatNewPwd:'',
                 },
                 pwdFormRules:{
                     newPwd:[
                         {
                             required: true,
                             message: '请输入新的密码',
                             trigger: 'blur'
                         },
                         {
                             type: 'string',
                             pattern: /^\w{6,16}$/,
                             message: '请输入6~16密码',
                             trigger: 'blur,change'
                         }
                     ],
                     repeatNewPwd:[
                         {
                             required: true,
                             message: '请再次输入新的密码',
                             trigger: 'blur'
                         },
                         {
                             type: 'string',
                             pattern: /^\w{6,16}$/,
                             message: '请输入6~16密码',
                             trigger: 'blur,change'
                         }
                     ]

                 },
                 verifyCodeBtnText:'发送验证码',
                 isCanSendVerifyCode:true,
                 verifyCodeSendTimeoutCnt:60,
             }
        },
        methods:{
            onClickSendSms:function () {
                if(!this.isCanSendVerifyCode){
                    return;
                }
                this.isCanSendVerifyCode = false;
                var timeoutNum = new Number(this.verifyCodeSendTimeoutCnt);

                this.verifyCodeBtnText = timeoutNum.toString();
                var timer = setInterval(() => {
                    this.verifyCodeSendTimeoutCnt--;
                    if(this.verifyCodeSendTimeoutCnt == 0){
                        this.verifyCodeBtnText ='发送验证码';
                        this.isCanSendVerifyCode = true;
                        this.verifyCodeSendTimeoutCnt = 60;
                        clearInterval(timer);
                    }
                    else{
                        var timeoutNum = new Number(this.verifyCodeSendTimeoutCnt);

                        this.verifyCodeBtnText = timeoutNum.toString();
                    }
                }, 1000);
                let reqParam = {};
                reqParam = {
                    mobile:this.enterpriseTelphone,
                    scene:2,
                };

                this.$http.ajaxGet({
                    url: 'member/sendVerifyCode',
                    params:reqParam
                }, (res) => {
                    this.$http.aop(res, (isSuccess) => {
                        if(isSuccess){
                            Message.success('验证码发送成功');
                        }
                        else{
                            Message.error('验证码发送失败');
                        }

                    });

                });

            },
            onClickModifyPwd:function () {
                if(this.pwdForm.newPwd == ''){
                    Message.warning('请输入密码');
                    return;
                }
                if(this.pwdForm.newPwd == this.pwdForm.repeatNewPwd){
                    this.isShowTip = false;
                }
                else{
                    this.isShowTip = true;
                    return;
                }
                if(this.acctForm.smsVerifyCode==''){
                    Message.warning('请输入验证码');
                    return;
                }
                let reqParam = {};
                reqParam = {
                    mobile:this.enterpriseTelphone,
                    verifyCode:this.acctForm.smsVerifyCode,
                    newPassword:md5(this.pwdForm.newPwd)

                };
                this.$http.ajaxGet({
                    url: 'member/findPassword',
                    params:reqParam
                }, (res) => {
                    this.$http.aop(res, (isSuccess) => {
                        if(isSuccess){
                            Message.success('修改密码成功');
                            this.isShowModifyPwdDialog = false;
                        }
                        else{
                            Message.error('修改密码失败');
                        }

                    });

                });

            },
            showModifyPwdDialog:function () {
               this.isShowModifyPwdDialog = true;
            }

        },
        mounted(){
            this.$http.ajaxGet({
                url: 'enterprise/query'
            }, (res) => {
                this.$http.aop(res, (isSuccess) => {
                    var enterpriseInfo = res.body.data.enterprise;

                    this.enterpriseTelphone = enterpriseInfo.account;

                });

            });
        }
    }
</script>