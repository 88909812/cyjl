import { app } from "../app";
import { Server } from "./ServerBase";
export class SocketServer extends Server {
    private socket: WebSocket;

    connectSuccessCallback: Function;

    close() {
        if (this.socket) {
            let sock = this.socket;
            sock.onopen = undefined;
            sock.onerror = undefined;
            sock.onmessage = undefined;
            sock.onclose = undefined;
            this.socket = null;
            sock.close();
        }
    }
    /**
     * 连接服务器
     */
    connect(listener?: Function): void {
        let url
        if (this.serverInfo.ip.indexOf(":") != -1 ) {
            url = "ws://" + this.serverInfo.ip +'/niu';
        }else{
            url = "ws://" + this.serverInfo.ip + ":" + this.serverInfo.port+'/niu';
        }
        console.log('url=====',url);
        this.socket = new WebSocket(url);
        this.socket.binaryType 	= "arraybuffer";
        this.socket.onopen 		= this.onOpen.bind(this);					// 建立socket连接成功后的回调
		this.socket.onerror 	= this.onError.bind(this); 	// 建立socket之前发生错误的回调
		this.socket.onmessage 	= this.onMessage.bind(this);				// 收到消息时候的回调
        this.socket.onclose 	= this.onClose.bind(this);					// 关闭socket时候的回调
        this.connectSuccessCallback = listener;

        console.log('this.socket=====',this.socket);
    }
    onOpen() {
		if(this.connectSuccessCallback) {
			this.connectSuccessCallback();
		}
	}

	onError(evt) {
        console.log('socket error ,evt =' + JSON.stringify(evt));
		this.close();
	}

	onMessage(evt) {
        this.recv(evt.data);
    }
    onClose() {
        console.log('onclose ');
        this.close();
        app.uiBaseEvent.emit('socketClose');
	}
    isNetOK(){
		if (!this.socket) {
			return false;
		}
		if (this.socket.readyState == 1) {
			return true;
		}
		return false;
    }
    isNetClose(){
		if (!this.socket) {
			return true;
		}
		if (this.socket.readyState === 3) {
			return true;
		}
		if(this.socket.readyState === 2) {
			this.close();
		}
		return false;
	}
    /**
     * 发送消息
     */
    send(bytes,listenerCb: Function = null,errorCb: Function = null) {
        if (!this.socket) {
            this.connect();
            setTimeout(()=> {
                this.send(bytes,listenerCb,errorCb);
            }, 1000);
            return;
        }
        if (this.socket.readyState == 0) {
            setTimeout(()=> {
                this.send(bytes,listenerCb,errorCb);
            }, 500);
            return;
        } else if (this.socket.readyState == 1) {
            try {
                this.listenerCb = listenerCb;
                this.errorCb = errorCb;
                this.socket.send(bytes);
            } catch (e) {
                console.log('socket send err ' + e.message);
            }
        } else if (this.socket.readyState == 2) {
            console.log('socket this.ws.readyState == 2');
        } else if (this.socket.readyState == 3) {
            console.log('socket this.ws.readyState == 3');
        }
    }


}
