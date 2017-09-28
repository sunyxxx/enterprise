<template>
    <section>
        <div class="index-cont">
            <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
                <h1 class="logo">法法社</h1>
                <input type="text" class="bk-form-input" v-model="ruleForm2.account" name="validation_name" placeholder="账号">
                <input type="password" class="bk-form-input" v-model="ruleForm2.checkPass" name="validation_name" placeholder="密码">
                <el-form-item prop="account"></el-form-item>
                <el-form-item prop="checkPass"></el-form-item>
                <el-form-item style="width: 100%">
                    <el-button type="primary" class="button" style="width:100%;margin-top: 0;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
                </el-form-item>
                <div class="other-link">
                    <a class=" fr" title="忘记密码" @click="isShowModifyPwdDialog=true">忘记密码?</a>
                </div>
                <span class="note">如忘记账号，请联系市场经理</span>

            </el-form>
        </div>
        <el-dialog title="修改密码" v-model="isShowModifyPwdDialog" :close-on-click-modal="false">
            <div class="modal-body change-psw-modal">

                <div class="verification">
                    <form class="bk-form">
                        <div class="bk-form-item">
                            <label class="bk-label">你的账号手机为：</label>
                            <div class="bk-form-content">
                                <input type="text" class="bk-form-input" name="" placeholder="请输入你的账号手机"  v-model="acctForm.acctPhone">
                                <!-- <span class="bk-label-text">13634340013</span> -->
                            </div>
                        </div>
                        <div class="bk-form-item">
                            <label class="bk-label">验证码：</label>
                            <div class="bk-form-content">
                                <input type="text" class="bk-form-input code-input" name="" placeholder="请输入您收到的验证码" v-model="acctForm.smsVerifyCode">
                                <button type="button" class="btn btn-default code-btn" @click="onClickSendSms">发送验证码</button>
                                <!-- 交互说明：
                                     点击发送后，切换为60秒后重新发送，并进行倒计时更改数字。
                                     同时按钮添加 disabled
                                -->
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
            <!--<el-form :model="acctForm" label-width="120px" :rules="acctFormRules" ref="acctForm">-->
                <!--<div style="width: 100%; margin: 0 auto;">-->
                    <!--<el-form-item label="你的账号手机：" prop="acctPhone">-->
                        <!--<el-input v-model="acctForm.acctPhone" auto-complete="off" style="width:50%"></el-input>-->
                    <!--</el-form-item>-->

                        <!--<el-form-item label="验证码：" prop="smsVerifyCode">-->
                            <!--<el-input v-model="acctForm.smsVerifyCode" auto-complete="off" style="width:50%"></el-input><el-button class="btn btn-default code-btn" style="margin-left: 10px" @click="onClickSendSms">发送验证码</el-button>-->
                        <!--</el-form-item>-->
                <!--</div>-->
            <!--</el-form>-->
            <!--<el-form :model="pwdForm" label-width="120px" :rules="pwdFormRules" ref="pwdForm">-->
                <!--<div style="width:100%;margin:0 auto;">-->
                    <!--<el-form-item label="输入新密码：" prop="newPwd">-->
                        <!--<el-input v-model="pwdForm.newPwd" auto-complete="off" style="width:50%" type="password"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="确认新密码：" prop="repeatNewPwd">-->
                        <!--<el-input v-model="pwdForm.repeatNewPwd" auto-complete="off" style="width:50%" type="password"></el-input>-->
                    <!--</el-form-item>-->

                    <!--<el-form-item>-->
                        <!--<div class="bk-form-content err" v-show="isShowTip">-->
                        <!--<span class="bk-label-text">两次密码输入不匹配，请重新输入</span>-->
                    <!--</div>-->
                    <!--</el-form-item>-->
                <!--</div>-->
            <!--</el-form>-->
            <!--<div class="modal-footer ta-c">-->
                <!--<a class="bk-button bk-primary" @click="onClickModifyPwd" title="确定修改">确定修改</a>-->
            <!--</div>-->

        </el-dialog>
    </section>
</template>
<script>
import '../style/css/bootstrap.min.css'
import '../style/css/bk_pro.css'
import '../style/css/iconfont.css'
import '../style/css/common.css'
import '../style/css/index.css'
import { md5 } from '../utils/util_main';
import { Message } from 'element-ui'




export default {
    data() {
        return {
            visible: false,
            logining: false,
            ruleForm2: {
                account: '',
                checkPass: ''
            },
            rules2: {
                account: [{
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                }, ],
                checkPass: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }]
            },
            checked: true,
            isShowModifyPwdDialog:false,
            isShowTip:false,
            acctForm:{
                acctPhone:'',
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

            }

        };
    },
    methods: {
        handleReset2() {
            this.$refs.ruleForm2.resetFields();
        },
        handleSubmit2(ev) {
            var _this = this;
            this.$refs.ruleForm2.validate((valid) => {
                if (valid) {
                    var loginParams = {
                        account: this.ruleForm2.account,
                        password: md5(this.ruleForm2.checkPass)
                    };
                    this.$http.ajaxGet({
                        url: 'member/login',
                        params: loginParams
                    }, (res) => {
                        this.$http.aop(res, (isSuccess) => {
                            sessionStorage.setItem('user', JSON.stringify(res.body.data));
                            this.$router.push({
                                path: '/baseinfo'
                            });


                        });

                    });


                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        onClickSendSms:function () {

            if(this.acctForm.acctPhone == ''){
                Message.warning('请输入手机号');
                return;
            }
            let reqParam = {};
            reqParam = {
                mobile:this.acctForm.acctPhone,
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
            if(this.acctForm.smsVerifyCode ==''){
                Message.warning('请输入验证码');
                return;
            }
            let reqParam = {};
            reqParam = {
                mobile:this.acctForm.acctPhone,
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
    },
    mounted() {

    }
}
</script>