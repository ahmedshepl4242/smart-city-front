import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check } from "lucide-react";
import axios from "axios";

const NotificationsPanel = ({ notifications, setNotifications, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const markAsRead = async (notificationId) => {
    try {
      // Update the notification status in the backend
      await axios.put(
        `http://localhost:8085/api/notifications/${notificationId}/read`
      );

      // Update the local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <Card className="w-80 absolute right-4 top-16 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No new notifications
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`
                    flex items-start space-x-4 p-3 rounded-lg cursor-pointer
                    transition-colors duration-200
                    ${
                      notification.isRead
                        ? "bg-gray-50"
                        : "bg-blue-50 hover:bg-blue-100"
                    }
                  `}
                >
                  <div className="flex-shrink-0">
                    {notification.isRead ? (
                      <Check className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Bell className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        notification.isRead ? "text-gray-600" : "text-gray-900"
                      }`}
                    >
                      {notification.type}
                    </p>
                    <p
                      className={`text-sm ${
                        notification.isRead ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;
