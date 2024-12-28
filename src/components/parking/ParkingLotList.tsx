import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Car } from 'lucide-react';
import { ParkingLot } from '@/types/parking';

interface ParkingLotListProps {
  lots: ParkingLot[];
  selectedLot: ParkingLot | null;
  onLotSelect: (lot: ParkingLot) => void;
}

export const ParkingLotList: React.FC<ParkingLotListProps> = ({
  lots,
  selectedLot,
  onLotSelect,
}) => {
  return (
    <div className="grid gap-4">
      {lots.map(lot => (
        <Card 
          key={lot.id}
          className={`cursor-pointer transition-all ${
            selectedLot?.id === lot.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onLotSelect(lot)}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{lot.name}</h3>
                <div className="flex items-center text-gray-500 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{lot.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-success-600">
                  ${lot.currentPrice}
                  <span className="text-sm font-normal text-gray-500">/hr</span>
                </div>
                {lot.currentPrice > lot.basePrice && (
                  <div className="text-sm text-warning-500">Surge pricing active</div>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Car className="w-4 h-4 mr-1 text-primary" />
                  <span className="text-sm">{lot.capacity} spots</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-primary" />
                  <span className="text-sm">24/7</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}