import { app } from '../app';
import * as md5 from '../libs/md5';
const Chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
export function HttpGetIP(cb) {
    let url = "http://pv.sohu.com/cityjson?ie=utf-8";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            let response = xhr.responseText;
            console.log('response===',response);
            try {
                let res = response.match(/(?<="cip": ")[0-9.]+/)[0];
                cb(res);
            }
            catch (err) {
                cc.error(err);
                return;
            }
        }
    };
    xhr.timeout = 3000;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
}

export function OpenAlipayUrl(userId) {
    let url = 'http://www.vsniumowang.com/alipay/openApp?state=';
    let userIdStr = userId.toString();
    let randStr = '';
    for (let index = 0; index < 5; index++) {
        const randID = Math.floor(Math.random()*Chars.length);
        randStr += Chars[randID];
    }
    let timeSecond = Math.floor(new Date().getTime() / 1000);
    let sign = md5(userIdStr + randStr + timeSecond);
    url += (userIdStr + '|');
    url += (randStr + '|');
    url += (timeSecond + '|');
    url += (sign);
    cc.sys.openURL(url);
}

export function HttpFormPost(reqUrl:string, params:{[x:string]:any}, cb: Function, errorCb?: Function) {
    let url = 'http://' + app.channelConfig.domain + '/' + reqUrl;
    console.log(url);
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            let response = xhr.responseText;
            console.log('response===', response);
            try {
                let res = JSON.parse(response);
                cb(res);
            }
            catch (err) {
                cc.error(err);
                return;
            }
        }
    };
    xhr.ontimeout = () => {
        if (errorCb){
            errorCb();
        }
    }
    xhr.onerror = (err)=>{
        if (errorCb){
            errorCb();
        }
    }
    xhr.timeout = 5000;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

    let allParams:{[x:string]:any} = {};
    for (const key in params) {
        allParams[key] = params[key];
    }
    allParams.appid = '1000';
    allParams.ts = new Date().getTime();

    var p =[];
    for(let key in allParams){
        p.push(`${key}=${allParams[key]}`);
    }
    p.sort((a, b) => { return a.charCodeAt(0) - b.charCodeAt(0); });
    var strParams = p.join('&');
    let signStr = strParams + '&tjbj2nnme5sj2wqzkm3rzec123vihrxu';
    signStr = md5(signStr);
    signStr = signStr.toLowerCase();
    strParams += ('&sign=' + signStr);
    xhr.send(strParams);
}

export function HttpUrlGet(reqUrl:string, params:{[x:string]:any}, cb: Function, errorCb?: Function) {
    let url = 'http://' + app.channelConfig.domain + '/' + reqUrl;
    let allParams:{[x:string]:any} = {};
    for (const key in params) {
        allParams[key] = params[key];
    }
    allParams.appid = '1000';
    allParams.ts = new Date().getTime();

    var p =[];
    for(let key in allParams){
        p.push(`${key}=${allParams[key]}`);
    }
    p.sort((a, b) => { return a.charCodeAt(0) - b.charCodeAt(0); });
    var strParams = p.join('&');
    let signStr = strParams + '&tjbj2nnme5sj2wqzkm3rzec123vihrxu';
    signStr = md5(signStr);
    signStr = signStr.toLowerCase();
    strParams += ('&sign=' + signStr);

    url = url +'?'+ strParams;
    cc.log(url);

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            let response = xhr.responseText;
            //console.log('response===', response);
            try {
                let res = JSON.parse(response);
                cb(res);
            }
            catch (err) {
                cc.error(err);
                return;
            }
        }
    };
    xhr.ontimeout = () => {
        if (errorCb) {
            errorCb();
        }
    }
    xhr.onerror = (err) => {
        if (errorCb) {
            errorCb();
        }
    }
    xhr.timeout = 10000;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
    xhr.send();
}