import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Clock, CreditCard } from 'lucide-react';

interface BookingFormProps {
  spotId: string;
  price : number;
  onBookingComplete: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  spotId,
  price,
  onBookingComplete,
}) => {
  const [hours, setHours] = useState(1);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual payment processing
    toast({
      title: "Booking Confirmed!",
      description: `You have booked spot ${spotId} for ${hours} hours.`,
    });
    onBookingComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Duration</Label>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <Input
                type="number"
                min="1"
                max="24"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="w-20"
              />
              <span className="text-gray-500">hours</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Details</Label>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <Input placeholder="Card number" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="MM/YY" />
              <Input placeholder="CVC" />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Rate per hour</span>
              <span>${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Duration</span>
              <span>{hours} hours</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${(price * hours).toFixed(2)}</span>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Confirm Booking
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;