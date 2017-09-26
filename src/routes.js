import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import BaseInfo from './views/BaseInfo.vue'
import Main from'./views/Main.vue'
import SmsOrder from './views/SmsOrder.vue'
import MailOrder from './views/MailOrder.vue'
let routes = [ 
    { path: "/", redirect: "/home" },//重定向
    { path: '/', name: '', component: Login, hidden: true }, // 帐密登录
    { path: '/login', component: Login, name: '', hidden: true }, // 帐密登录
    {
        path: '/',
        component: Home,
        iconCls: '', //图标样式class
        name: '菜单',
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/baseinfo', component: BaseInfo, name: '基本信息' },
            { path: '/smsorder',component:SmsOrder,name:'短信订单'},
            { path:'/mailorder',component:MailOrder,name:'电子信函'},
            { path: '*', name: '', component: NotFound, hidden: true },
            { path: '/404', component: NotFound, name: '', hidden: true }
        ]
    },
    
];
export default routes;
