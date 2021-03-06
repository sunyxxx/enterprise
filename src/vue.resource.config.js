import Vue from 'vue'
import VueResource from 'vue-resource'
import { Message } from 'element-ui'

Vue.component(Message.name, Message);

let count = 0;

Vue.use(VueResource);
//Vue.http.options.emulateJSON = true;
//Vue.http.options.root = 'http://119.23.52.238/cgi-admin/';
//Vue.http.options.root = 'http://test.pc.fafashe.com/cgi/';
Vue.http.options.root = 'http://pc.fafashe.com/cgi/';
//Vue.http.options.root = 'http://localhost:8091/';
//Vue.http.options.root = 'http://10.9.2.173:8080/';

Vue.http.interceptors.push((req, next) => {
    count++;
    next((res) => {
        if (--count === 0) {}
    });
});

Vue.http.aop = function(res, cb) {

    var isSuccess = false;
    if (!res.ok) {
        Message.warning('接口异常');
    } else if (res.body) {
        switch (res.body.ret) {
            // 正常
            case 0:
                isSuccess = true;
                break;
                // 未登录
            case 10000:
                //todo 
                Message.warning(res.body.errmsg);
                //window.location.href ='/login'
                break;
                // 异常
            default:
                Message.warning(res.body.errmsg || '服务器忙');
                break;
        }
    }

    cb && cb(isSuccess);
}

Vue.http.ajaxPost = function(obj, fun) {
    Vue.http.post(obj.url,
        obj.params, {
            'headers': {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
        fun && fun(res);
    }, (res) => {
        Vue.http.aop(res);
    });

}

Vue.http.ajaxGet = function(obj, fun) {
    Vue.http({
        method: 'get',
        url: obj.url,
        params: obj.params,
    }).then((res) => {
        fun && fun(res);
    }, (res) => {
        Vue.http.aop(res);
    });
}
