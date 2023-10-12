export default class WebSocketClient {
  constructor(opthios) {
    this.handlerOptions = opthios;
    this.url = opthios.socketUrl;
    this.ws = null;
    this.heartbeatIntervalId = null;
    this.reconnectIntervalId = null;
    this.HEARTBEAT_INTERVAL = opthios.heartTime;
    this.RECONNECT_INTERVAL = 3000;//重连计时器:只读
    this.connect();
  }

  // WebSocket 连接函数
  connect () {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.handlerOptions.onopen && this.handlerOptions.onopen()
      // 连接成功后启动心跳定时器
      this.startHeartbeat();
      // 停止重连计时器
      this.stopReconnect();
    };

    this.ws.onmessage = (event) => {
      // console.log('Received message:', event.data);
      // 处理接收到的消息
      this.handlerOptions.onmessage && this.handlerOptions.onmessage(event.data)
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed with code:', event.code, 'reason:', event.reason);
      this.handlerOptions.onclose && this.handlerOptions.onclose()
      // 关闭连接后停止心跳
      this.stopHeartbeat();
      // 停止重连计时器
      this.stopReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.handlerOptions.onerror && this.handlerOptions.onerror()
      // 发生错误后停止心跳
      this.stopHeartbeat();
      // 停止重连计时器
      this.stopReconnect();
      //    重新连接
      this.startReconnect();
    };
  }

  // 发送消息函数
  send (data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.error('WebSocket not connected');
    }
  }

  // 启动心跳定时器
  startHeartbeat () {
    this.heartbeatIntervalId = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        // 发送心跳消息
        this.ws.send('heartbeat');
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  // 停止心跳定时器
  stopHeartbeat () {
    clearInterval(this.heartbeatIntervalId);
  }

  // 启动重连定时器
  startReconnect () {
    this.reconnectIntervalId = setInterval(() => {
      console.log('Reconnecting WebSocket...');
      this.connect();
    }, this.RECONNECT_INTERVAL);
  }

  // 停止重连定时器
  stopReconnect () {
    clearInterval(this.reconnectIntervalId);
  }

  // 关闭 WebSocket 连接
  close () {
    this.ws.close();
  }
}
