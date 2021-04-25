import { app } from "../app";

export default class SoundManager {
    private static instance: SoundManager;

    private constructor() {
        //如果没有设置过，值为undefine，默认有声音
        if (app.userConfig.musicSwitch == false) {
            this.setMusicSwitch(false);
        }else{
            this.setMusicSwitch(true);
        }
        if (app.userConfig.effectsSwitch == false) {
            this.setEffectsSwitch(false)
        }else{
            this.setEffectsSwitch(true)
        }
    }
	static getIns(): SoundManager {
		if(!SoundManager.instance) {
			SoundManager.instance = new SoundManager();
		}
		return SoundManager.instance;
    }
    setMusicSwitch(isOn) {
        app.userConfig.musicSwitch = isOn;
        cc.audioEngine.setMusicVolume(isOn ? 0.6 : 0);
    }
    setEffectsSwitch(isOn) {
        app.userConfig.effectsSwitch = isOn;
        cc.audioEngine.setEffectsVolume(isOn ? 1 : 0);
    }
    getMusicSwitch(){
        return cc.audioEngine.getMusicVolume() != 0;
    }
    getEffectsSwitch(){
        return cc.audioEngine.getEffectsVolume() != 0;
    }

    playBackgroundMusic(){
        cc.audioEngine.stopMusic();
        cc.resources.load('sounds/bgm', cc.AudioClip, (err, clip:cc.AudioClip)=> {
            if (err) {cc.log(err);return;}
            cc.audioEngine.playMusic(clip, true);
        });
    }

    playGameLose(){
        cc.resources.load('sounds/gameFail', cc.AudioClip, (err, clip:cc.AudioClip)=> {
            if (err) {cc.log(err);return;}
            cc.audioEngine.playEffect(clip, false);
        });
    }
    playGameWin(){
        cc.resources.load('sounds/gamePass', cc.AudioClip, (err, clip:cc.AudioClip)=> {
            if (err) {cc.log(err);return;}
            cc.audioEngine.playEffect(clip, false);
        });
    }
    playGetReward(){
        cc.resources.load('sounds/getReward', cc.AudioClip, (err, clip:cc.AudioClip)=> {
            if (err) {cc.log(err);return;}
            cc.audioEngine.playEffect(clip, false);
        });
    }
    playBossComming(){
        cc.resources.load('sounds/bossCome', cc.AudioClip, (err, clip:cc.AudioClip)=> {
            if (err) {cc.log(err);return;}
            cc.audioEngine.playEffect(clip, false);
        });
    }
    // update (dt) {}
}
