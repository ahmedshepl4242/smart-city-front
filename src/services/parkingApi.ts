import { ParkingLot, ParkingSpot } from '@/types/parking';

const API_BASE_URL = 'http://localhost:8085/parking';

export const parkingApi = {
  async fetchParkingLots(): Promise<ParkingLot[]> {
    const response = await fetch(`${API_BASE_URL}/lots`);
    if (!response.ok) throw new Error('Failed to fetch parking lots');
    return response.json();
  },

  async fetchParkingSpots(lotId: number): Promise<ParkingSpot[]> {
    const response = await fetch(`${API_BASE_URL}/spots/${lotId}`);
    if (!response.ok) throw new Error('Failed to fetch parking spots');
    return response.json();
  },

  async updateSpotStatus(spotId: number, status: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/spot/status/${spotId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newStatus: status }),
    });
    if (!response.ok) throw new Error('Failed to update spot status');
  }
}