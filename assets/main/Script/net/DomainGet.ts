import { app } from "../app";

export class DomainGet{
    domain:string;
    channel:string;
    group:string;
    constructor() {
        return this;
    }

    getPackedChannel(){
        if (cc.sys.isNative) {
            if (cc.sys.platform == cc.sys.ANDROID) {
                return this.channel;
            }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
                return 'ios';
            }else{
                return 'other';
            }
        }else{
            return 'other';
        }
        
    }

    initDomain(){
        let channelConfigStr = cc.sys.localStorage.getItem('channelConfig');
        if (channelConfigStr && channelConfigStr.length > 0) {
            app.channelConfig = JSON.parse(channelConfigStr);
            this.domain = app.channelConfig.domain;
            this.channel = app.channelConfig.channel;
            this.group = app.channelConfig.group;
        } else {
            //读取打进包里的配置文件
            let groupStr = app.platform.getInjection();
            if (!groupStr || groupStr === '') {//如果没有检测到渠道文件，直接用默认的配置
                this.setDefaultConfig();
            } else {
                let groupArr = groupStr.split('|');
                if (groupArr.length < 3) {
                    console.log('渠道文件加载错误');
                    this.setDefaultConfig();
                } else {
                    this.domain = groupArr[2];
                    this.channel = groupArr[0];
                    this.group = groupArr[1];
                }
            }
            app.channelConfig = {
                domain:this.domain,
                channel:this.channel,
                group:this.group
            }
            console.log('channel===',app.channelConfig.channel);
            console.log('group===',app.channelConfig.group);
            console.log('domain===',app.channelConfig.domain);
            cc.sys.localStorage.setItem('channelConfig', JSON.stringify(app.channelConfig));
        }
    }
    setDefaultConfig(){
        this.domain = '121.196.50.252:8080';
        this.channel = 'a_01';
        this.group = 'test';
    }
}