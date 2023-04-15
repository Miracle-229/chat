import * as StompJs from "@stomp/stompjs";
//надстройка для веб-сокетов

export function createStompClient(onNewMessage) {
  let client = new StompJs.Client({
    brokerURL: "ws://localhost:8080/actions",
    debug: function (str) {
      console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });
  configureStompClient(client, onNewMessage);
  client.activate();
}

//для получения сообщений

function configureStompClient(client, onNewMessage) {
  console.log('Configure stomp client in progress...');
  client.onConnect = () => {
    client.subscribe('/async/api/action', onNewMessage);
  };
  client.onStompError = (frame) => {
    console.error(frame.headers['message']);
    console.error('Details:', frame.body);
  };
  client.onWebSocketError = (error) => {
    console.error(error);
  }
}