
export class Message {
    static HeartBeat = '0x000001';
    static Login = '0x000100';
    static SendEnterComplete = '0x000101';// 登录成功后通知加载进入完毕
    static SendMPUserInfo = '0x000102';// 发送微信平台用户信息
    static GetRankData = '0x000103';
    static ReqSignInfo = '0x000104';//获取签到信息
    static GetSign = '0x000105';// 普通领取签到奖励
    static SendBindStr = '0x000106';// 发送绑定信息 用于绑定账号 str格式 = "promoterId:13542"
    static SendStory = '0x000107';//剧情(新手引导数据)
    static GetCyExplain = '0x000108';//获取成语释义
    static ClientTell = '0x000109';
    static GetPlayerValueByKey = '0x00010A';//根据key获取用户数据
    static GetInviteShare = '0x00010B';
    static StartVideo = '0x000110'; // 开始观看视频
    static FinishVideo = '0x000111';// 观看视频完毕
    static SendConnect = '0x000113';
    static GetPutongVideoBox = '0x000114';//VideoBox上普通领取按钮点击
    static ReqLogout = '0x0001FF';
    static CallDaddy = '0x0001FE';// 管理员消息 

    static RequestGuanKaInfo = '0x010001';//获取关卡信息
    static StartGuanKa = '0x010002';// 开始关卡
    static SendCyComplete = '0x010003';// 完成关卡的某个成语 服务端接收后加奖励 客户端自己飞奖励
    static SendGuanKaComplete = '0x010004';//关卡完成 关卡是否完成正确 服务端不进行检测 客户端检测正确即可
    static SendUseFreeTip = '0x010005';
    static GetGuanKaAward = '0x010006';
    
    static RequestWithDraw = '0x000801';// 申请提现
    static GetStoneDetail = '0x000802';
    static ReqExchange = '0x000803';

    static cmd = {
        '0x000100': 'BackLogin',
        '0x000101': 'BackCyExplain',
        '0x000102': 'UpdateLeftTiliSec',
        '0x000103': 'UserAttr',
        '0x000104': 'RankData',
        '0x000105': 'SendLeftTiliSec',//重置签到剩余秒数
        '0x000106':'SendLvlExp',//修为升级进度条 这里的exp和玩家属性的exp不是一个概念
        '0x000107': 'Sign',
        '0x000108': 'BackGetSign',
        '0x000109': 'SendInviteShare',

        '0x00010A': 'SendPlayerKV',//用户数据(根据key)key = lianxuqiandao  连续签到天数 value = "3"
        '0x00010D': 'ConnectAddress',

        '0x000110': 'BackStartVideo',
        '0x000111': 'BackFinishVideo',
        '0x000112': 'BroadcastMsg',//系统广播消息
        '0x000113': 'BehaviorInfo',//行为信息 登录完成后延时发送
        '0x000114': 'SendVideoBox',// 通知客户端显示视频弹框
        '0x000115': 'BackBoxPutongButton',// VideoBox中普通领取按钮点击后的反馈
        
        '0x0001FF': 'Logout',

        '0x000801': 'BackRequestWithDraw',
        '0x000802': 'MoneyDetail',

        '0x010001': 'GuanKaInfoList',
        '0x010002': 'BackStartGuanKa',
        '0x010003': 'BackGuanKaComplete',//显示通关奖励领取
        '0x010004':'BackGetGuanKaAward',
        '0x01000F': 'SendReachEnd',//已通关
    }

    static attrNameMapValue = {
        'name':'strVal',
        'avatar':'strVal',
        'bitVal':'numberVal',
        'stone':'numberVal',
        'money':'numberVal',
        'tili':'numberVal',
        'exp':'numberVal',
        'lvl':'numberVal',
    }
}