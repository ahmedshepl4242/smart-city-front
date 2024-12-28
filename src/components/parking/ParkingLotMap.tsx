import React from 'react';
import { ParkingSpot as ParkingSpotType } from '@/types/parking';
import { ParkingSpotComponent } from './ParkingSpotComponent';

interface ParkingLotMapProps {
  lots: Array<any>; // Not used in this component but required by parent
  selectedLot: any; // Not used in this component but required by parent
  parkingSpots: ParkingSpotType[];
  onSpotSelect: (spotId: string, pricePerHour: number) => void;
}

const ParkingLotMap: React.FC<ParkingLotMapProps> = ({
  parkingSpots = [],
  onSpotSelect,
}) => {
  if (!Array.isArray(parkingSpots)) {
    return <div className="p-4 text-red-500">Error: Invalid parking spots data.</div>;
  }
  console.log(`ParkingSpotComponent: Available status is ${parkingSpots}`);

  if (parkingSpots.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
        No parking spots available for this lot.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Select a Parking Spot</h3>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {parkingSpots.map((spot) => (
          <ParkingSpotComponent
            key={spot.id}
            id={spot.id.toString()}
            available={spot.available}
            type={spot.type}
            pricePerHour={spot.pricePerHour}
            spotNumber={spot.spotNumber}
            onClick={() => onSpotSelect(spot.id.toString(), spot.pricePerHour)}
          />
        ))}
      </div>
    </div>
  );
};

export default ParkingLotMap;