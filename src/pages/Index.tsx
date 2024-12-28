import React, { useState, useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import ParkingLotMap from "@/components/parking/ParkingLotMap";
import BookingForm from "@/components/parking/BookingForm";
import { ParkingLotList } from "@/components/parking/ParkingLotList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parkingApi } from "@/services/parkingApi";
import { useParkingWebSocket } from "@/hooks/useParkingWebSocket";
import { ParkingLot, ParkingSpot } from "@/types/parking";
import "../polyfills"; // Import the polyfill file to ensure global is defined
import axios from "axios";
import NotificationsPanel from "../components/NotificationsPanel";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<string>();
  const [selectedSpotPrice, setSelectedSpotPrice] = useState<number>();
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const { toast } = useToast();

  // Handle WebSocket updates
  useParkingWebSocket((updatedSpot) => {
    setParkingSpots((prevSpots) =>
      prevSpots.map((spot) =>
        spot.id === updatedSpot.id
          ? { ...spot, isAvailable: updatedSpot.isAvailable }
          : spot
      )
    );
  });
  useEffect(() => {
    const hakonamatata = async () => {
      try {
        const response = await fetch(
          `http://localhost:8085/parking/parking/${selectedLot.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Hakonamatata: Parking Spot Updates Received", data);

        // Assuming the response contains updated parking spots
        setParkingSpots(data);
      } catch (error) {
        console.error("Hakonamatata Error:", error);
      }
    };

    if (selectedLot) {
      const intervalId = setInterval(() => {
        hakonamatata(); // Pass the selected lot ID
      }, 5000); // Call the backend every 5 seconds

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [selectedLot]);

  // Fetch parking lots
  useEffect(() => {
    const loadParkingLots = async () => {
      try {
        const lots = await parkingApi.fetchParkingLots();
        setParkingLots(lots);
        if (lots.length > 0) {
          setSelectedLot(lots[0]);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load parking lots",
        });
      }
    };

    loadParkingLots();
  }, []);
  // Function to fetch notifications by user ID
  const fetchNotifications = async (userId) => {
    // console.log("Fetching notifications");
    // console.log("Fetching notifications");
    // console.log("Fetching notifications");
    // console.log("Fetching notifications");
    try {
      const response = await axios.get(
        `http://localhost:8085/api/notifications/users/${userId}`
      );

      console.log("Notifications Received");
      console.log(response.data);

      const data = await response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return [];
    }
  };
  // Improved notification display function
  const displayNotifications = () => {
    if (notifications.length > 0) {
      // Create a slight delay between each notification
      notifications.forEach((notification, index) => {
        setTimeout(() => {
          toast({
            title: notification.type || "Notification",
            description: notification.message,
            // Optional: Add different styling based on notification type
            variant: notification.variant || "default",
            // Ensure each notification stays visible long enough to be read
            duration: 5000,
          });
        }, index * 1000); // 1 second delay between each notification
      });
    } else {
      toast({
        title: "No Notifications",
        description: "You have no new notifications.",
      });
    }
  };
  // Fetch notifications on component load
  useEffect(() => {
    const loadNotifications = async () => {
      if (isAuthenticated) {
        const userId = 2; // Replace with the actual user ID
        const fetchedNotifications = await fetchNotifications(userId);
        console.log(fetchedNotifications);
        // console.log("********************************");
        // console.log("********************************");
        // console.log("********************************");
        // console.log("********************************");
        setNotifications(fetchedNotifications);
      }
    };

    loadNotifications();
  }, [isAuthenticated]);
  // Fetch parking spots when selected lot changes
  useEffect(() => {
    const loadParkingSpots = async () => {
      if (selectedLot) {
        try {
          const spots = await parkingApi.fetchParkingSpots(selectedLot.id);
          setParkingSpots(spots);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load parking spots",
          });
        }
      }
    };

    loadParkingSpots();
  }, [selectedLot]);

  const handleSpotSelect = (spotId: string, pricePerHour: number) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please login to book a parking spot",
      });
      return;
    }
    setSelectedSpot(spotId);
    setSelectedSpotPrice(pricePerHour);
    setShowBookingForm(true);
  };

  const handleBookingComplete = () => {
    setShowBookingForm(false);
    setSelectedSpot(undefined);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Smart City Parking
            </h1>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <AuthForm onSuccess={() => setIsAuthenticated(true)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Smart City Parking
            </h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() =>
                  setShowNotificationsPanel(!showNotificationsPanel)
                }
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                    {notifications.length}
                  </span>
                )}
              </Button>
              {showNotificationsPanel && (
                <NotificationsPanel
                  notifications={notifications}
                  setNotifications={setNotifications}
                  onClose={() => setShowNotificationsPanel(false)}
                />
              )}
              <Button
                variant="outline"
                onClick={() => setIsAuthenticated(false)}
              >
                Logoutnot
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Find Parking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="space-y-2">
                    <h3 className="font-medium">Quick Filters</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        Available Now
                      </Button>
                      <Button variant="outline" size="sm">
                        EV Charging
                      </Button>
                      <Button variant="outline" size="sm">
                        Disabled Spots
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {showBookingForm && selectedSpot && (
              <BookingForm
                spotId={selectedSpot}
                price={selectedSpotPrice}
                onBookingComplete={handleBookingComplete}
              />
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <ParkingLotList
              lots={parkingLots}
              selectedLot={selectedLot}
              onLotSelect={setSelectedLot}
            />

            <ParkingLotMap
              lots={parkingLots}
              selectedLot={selectedLot}
              onSpotSelect={handleSpotSelect}
              parkingSpots={parkingSpots}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
