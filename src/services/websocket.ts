import { Client, Message, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ParkingSpot } from '@/types/parking';

const SOCKET_URL = 'http://localhost:8085/parking-status';

export class WebSocketService {
  private static instance: WebSocketService;
  private stompClient: Client | null = null;
  private subscribers: ((spot: ParkingSpot) => void)[] = [];

  private constructor() {
    this.connect();
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private connect() {
    const socket = new SockJS(SOCKET_URL);
    this.stompClient = Stomp.over(socket);

    this.stompClient.debug = (str: string) => {
      console.log(`STOMP: ${str}`);
    };

    this.stompClient.onConnect = () => {
      console.log('WebSocket Connected');
      this.stompClient?.subscribe('/topic/updates', (message: Message) => {
        try {
          const updatedSpot: ParkingSpot = JSON.parse(message.body);
          this.notifySubscribers(updatedSpot);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message'], frame.body);
    };

    this.stompClient.onDisconnect = () => {
      console.log('WebSocket Disconnected');
    };

    this.stompClient.activate();
  }

  subscribe(callback: (spot: ParkingSpot) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  private notifySubscribers(spot: ParkingSpot) {
    this.subscribers.forEach((callback) => callback(spot));
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('WebSocket Disconnected');
    }
  }
}
