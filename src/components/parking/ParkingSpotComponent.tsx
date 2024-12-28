import React from 'react';
import { cn } from '@/lib/utils';
import { Car, Zap, Accessibility } from 'lucide-react';

interface ParkingSpotProps {
  id: string;
  available: boolean;
  type: string;
  pricePerHour: number;
  spotNumber: string;
  onClick: () => void;
}

export const ParkingSpotComponent: React.FC<ParkingSpotProps> = ({
  available,
  type,
  pricePerHour,
  spotNumber,
  onClick,
}) => {
  console.log(`ParkingSpotComponent: Available status is ${available}`); // Log the availability status

  const getSpotIcon = () => {
    switch (type.toUpperCase()) {
      case 'EV_CHARGING':
        return <Zap className="w-6 h-6" />;
      case 'DISABLED':
        return <Accessibility className="w-6 h-6" />;
      default:
        return <Car className="w-6 h-6" />;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={!available}
      className={cn(
        'p-4 rounded-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2',
        available
          ? 'bg-green-100 hover:bg-green-200 cursor-pointer'
          : 'bg-red-100 cursor-not-allowed opacity-60',
      )}
    >
      {getSpotIcon()}
      <span className="text-sm font-medium">{spotNumber}</span>
      <span className="text-xs">${pricePerHour}/hr</span>
    </button>
  );
};

export default ParkingSpotComponent;
