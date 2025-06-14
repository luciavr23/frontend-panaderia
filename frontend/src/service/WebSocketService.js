import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";
import {baseUrl} from "../utils/constants";

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.subscribers = new Map();
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (this.connected) return;

    // Reemplazamos el host local por baseUrl + /ws
    const wsEndpoint = `${baseUrl.replace(/^https?/, "http")}/ws`;
    const socket = new SockJS(wsEndpoint);

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log("WebSocket Debug:", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = () => {
      console.log("Conectado al WebSocket");
      this.connected = true;
      this.reconnectAttempts = 0;
      this.subscribeToTopics();
    };

    this.stompClient.onStompError = (frame) => {
      console.error("Error en WebSocket:", frame);
      this.connected = false;
    };

    this.stompClient.onWebSocketClose = () => {
      console.log("Conexión WebSocket cerrada");
      this.connected = false;
      this.attemptReconnect();
    };

    this.stompClient.activate();
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Intento de reconexión ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );
      setTimeout(() => this.connect(), 5000);
    } else {
      console.error("Máximo número de intentos de reconexión alcanzado");
    }
  }

  subscribeToTopics() {
    if (!this.connected) return;

    this.stompClient.subscribe("/topic/new-order", (message) => {
      const order = JSON.parse(message.body);
      this.notifySubscribers("new-order", order);
    });

    this.stompClient.subscribe("/topic/order-cancelled", (message) => {
      const order = JSON.parse(message.body);
      this.notifySubscribers("order-cancelled", order);
    });
  }

  addSubscriber(topic, callback) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic).add(callback);
  }

  removeSubscriber(topic, callback) {
    if (this.subscribers.has(topic)) {
      this.subscribers.get(topic).delete(callback);
    }
  }

  notifySubscribers(topic, data) {
    if (this.subscribers.has(topic)) {
      this.subscribers.get(topic).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error("Error al notificar suscriptor:", error);
        }
      });
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.connected = false;
    }
  }
}

export const webSocketService = new WebSocketService();
