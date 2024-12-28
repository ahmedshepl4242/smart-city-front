export interface ParkingLot {
  id: number;
  name: string;
  location: string;
  capacity: number;
  currentPrice: number;
  basePrice: number;
}

export interface ParkingSpot {
  id: number;
  lotId: number;
  isAvailable: boolean;
  pricePerHour: number;
  spotNumber: string;
  type: string;
}

export interface PricingRule {
  id: number;
  parkingLotId: number;
  startTime: string;
  endTime: string;
  multiplier: number;
}