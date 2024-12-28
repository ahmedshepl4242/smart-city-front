import { useEffect } from 'react';
import { WebSocketService } from '@/services/websocket';
import { ParkingSpot } from '@/types/parking';

export const useParkingWebSocket = (onSpotUpdate: (spot: ParkingSpot) => void) => {
  useEffect(() => {
    const webSocketService = WebSocketService.getInstance();
    const unsubscribe = webSocketService.subscribe(onSpotUpdate);

    return () => {
      unsubscribe();
    };
  }, [onSpotUpdate]);
}