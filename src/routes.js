import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import BaseInfo from './views/BaseInfo.vue'
import Main from './views/Main.vue'
import SmsOrder from './views/SmsOrder.vue'
import MailOrder from './views/MailOrder.vue'
import MailTmpl from './views/MailTmpl.vue'
let routes = [{
        path: '*',
        hidden: true,
        role: 0,
        redirect: { path: '/404' }
    },
    { path: '/', name: '', component: Login, hidden: true }, // 帐密登录
    { path: '/login', component: Login, name: '', hidden: true }, // 帐密登录
    { path: '/main', component: Main, name: '主页', hidden: true }, // 帐密登录
    {
        path: '/',
        component: Home,
        name: '订单管理',
        iconCls: 'icon-order',
        hidden: false,
        leaf: false, //只有一个节点
        paths: '/smsorder,/mailorder/',
        children: [
            { path: '/smsorder', component: SmsOrder, name: '短信订单' },
            { path: '/mailorder', component: MailOrder, name: '电子信函' }

        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '信函下载',
    //     iconCls: 'icon-order',
    //     hidden: false,
    //     leaf: true, //只有一个节点
    //     paths: '/mailtmpl/',
    //     children: [
    //         { path: '/mailtmpl', component: MailTmpl, name: '信函下载' }
    //     ]
    // },
    {
        path: '/',
        component: Home,
        iconCls: 'icon-empty', //图标样式class
        name: '基本信息',
        hidden: false,
        leaf: true, //只有一个节点
        paths: '/baseinfo',
        children: [
            { path: '/baseinfo', component: BaseInfo, name: '基本信息' }
        ]
    },
    { path: '*', name: '', component: NotFound, hidden: true },

];
export default routes;