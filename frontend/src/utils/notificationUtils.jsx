// utils/notificationUtils.js
import { CalendarPlusIcon, CheckCircleIcon, ExclamationIcon, InformationCircleIcon, RefreshIcon, XCircleIcon } from "../components/icons/Icons";

export const getNotificationMeta = (notification) => {
  const notificationTypes = {
    'StandardBooking': {
      title: 'New Booking Request',
      statusIcon: <CalendarPlusIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: <CalendarPlusIcon className="h-5 w-5 text-blue-500" />
    },
    'ReferralBooking': {
      title: 'New Referral Booking Request',
      statusIcon: <CalendarPlusIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      icon: <CalendarPlusIcon className="h-5 w-5 text-indigo-500" />
    },
    'Cancellation': {
      title: 'Appointment Cancelled',
      statusIcon: <XCircleIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: <XCircleIcon className="h-5 w-5 text-red-500" />
    },
    'Rescheduling': {
      title: 'Reschedule Request',
      statusIcon: <RefreshIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      icon: <RefreshIcon className="h-5 w-5 text-amber-500" />
    },
    'Confirmed': {
      title: 'Booking Confirmed',
      statusIcon: <CheckCircleIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />
    },
    'Missed': {
      title: 'Missed Appointment',
      statusIcon: <ExclamationIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: <ExclamationIcon className="h-5 w-5 text-purple-500" />
    }
  };

  return (
    notificationTypes[notification.notification_type] || {
      title: 'Notification',
      statusIcon: <InformationCircleIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: 'bg-gray-500',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
      icon: <InformationCircleIcon className="h-5 w-5 text-gray-500" />
    }
  );
};