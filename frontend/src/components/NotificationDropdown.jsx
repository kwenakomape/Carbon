import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  BellIcon,
  SettingsIcon,
  ArrowRightIcon,
  UserIcon,
  ClockIcon,
} from '../components/icons/Icons.jsx';
import { getNotificationMeta } from '../utils/notificationUtils.jsx';

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const NotificationDropdown = ({ userId, userData }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notificationIconRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Fetch notifications silently
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/notifications/${userId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark all as seen
  const markAllAsSeen = async () => {
    try {
      await axios.patch(`/api/notifications/mark-all-seen/${userId}`);
      setNotifications(prev => prev.map(n => ({ ...n, seen_status: true })));
    } catch (error) {
      console.error('Error marking notifications as seen:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.patch(`/api/notifications/mark-all-read/${userId}`);
      setNotifications(prev => prev.map(n => ({ ...n, read_status: true })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Mark single as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read/${userId}`);
      setNotifications(prev => 
        prev.map(n => n.notification_id === notificationId ? { ...n, read_status: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        notificationIconRef.current &&
        !notificationIconRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Setup polling
  useEffect(() => {
    // Initial fetch
    fetchNotifications();
    
    // Start polling every 30 seconds
    pollingIntervalRef.current = setInterval(fetchNotifications, 30000);

    // Optimize polling when window loses focus
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Slow down polling when tab is inactive
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = setInterval(fetchNotifications, 120000);
      } else {
        // Resume normal polling when tab is active
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = setInterval(fetchNotifications, 30000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(pollingIntervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && notifications.some(n => !n.seen_status)) {
      markAllAsSeen();
    }
  };

  const unseenCount = notifications.filter(n => !n.seen_status).length;
  const unreadCount = notifications.filter(n => !n.read_status).length;

  return (
    <div className="relative">
      <button
        ref={notificationIconRef}
        onClick={handleNotificationClick}
        className="relative p-2 text-gray-600 hover:text-blue-600 focus:outline-none transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        {unseenCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unseenCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <div
        ref={dropdownRef}
        className={`absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl z-50 transition-all duration-200 ease-in-out transform ${
          showNotifications
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 p-4 bg-white border-b border-gray-100 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="font-semibold text-gray-900 text-base">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            {notifications.length > 0 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50"
                >
                  Mark all read
                </button>
                <button className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors px-2 py-1 rounded hover:bg-gray-100">
                  <SettingsIcon className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[480px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <BellIcon className="h-6 w-6 text-gray-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                No notifications
              </h4>
              <p className="text-xs text-gray-500">You're all caught up</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const member = userData?.find(
                (item) => item.member_id === notification.member_id
              );
              const notificationMeta = getNotificationMeta(notification);

              return (
                <div
                  key={notification.notification_id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                    !notification.read_status ? 'bg-blue-50/30' : 'bg-white'
                  }`}
                  onClick={() => markAsRead(notification.notification_id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Profile Avatar */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        {notification?.initiated_by ? (
                          <span className="font-medium text-blue-600">
                            {notification.initiated_by
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        ) : (
                          <UserIcon className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${notificationMeta.statusColor}`}
                      >
                        {notificationMeta.statusIcon}
                      </div>
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3
                            className={`text-sm font-medium ${notificationMeta.textColor}`}
                          >
                            {notificationMeta.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {notificationMeta.description}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                          {dayjs
                            .utc(notification.timestamp)
                            .utcOffset(2)
                            .fromNow()}
                        </span>
                      </div>

                      {/* Contextual Details */}
                      {notification.notification_type === 'Rescheduling' &&
                        notification.confirmed_date && (
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <ClockIcon className="h-3.5 w-3.5 mr-1.5" />
                            <span>
                              Previously:{' '}
                              {dayjs(notification.confirmed_date).format(
                                'MMM D [at] h:mm A'
                              )}
                            </span>
                          </div>
                        )}

                      {/* Action Buttons */}
                      <div className="mt-3 flex gap-2">
                        <button
                          className="text-xs font-medium bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view action
                          }}
                        >
                          View details
                        </button>
                        {notification.notification_type ===
                          'New Booking Request' && (
                          <button
                            className="text-xs font-medium bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle confirm action
                            }}
                          >
                            Confirm
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.read_status && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-3"></div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="sticky bottom-0 p-3 border-t border-gray-100 bg-white rounded-b-xl text-center">
            <a
              href="#"
              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center"
            >
              View all notifications
              <ArrowRightIcon className="h-3 w-3 ml-1" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};