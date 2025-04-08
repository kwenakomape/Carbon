// utils/notificationUtils.js
//import { CalendarPlusIcon, CheckCircleIcon, ExclamationIcon, InformationCircleIcon, RefreshIcon, XCircleIcon } from "../components/icons/Icons";

import { 
  CalendarPlusIcon, 
  CheckCircleIcon, 
  ExclamationIcon, 
  InformationCircleIcon, 
  RefreshIcon, 
  XCircleIcon 
} from "../components/icons/Icons";

export const getNotificationMeta = (notification) => {
  const notificationTypes = {
    'New Booking Request': {
      title: 'New Booking Request',
      description: `${notification.initiated_by} has made a new booking request`,
      statusIcon: <CalendarPlusIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: <CalendarPlusIcon className="h-5 w-5 text-blue-500" />
    },
    // 'Appointment Confirmed': {
    //   title: 'Appointment Confirmed',
    //   description: `Your appointment has been confirmed`,
    //   statusIcon: <CheckCircleIcon className="h-2.5 w-2.5 text-white" />,
    //   statusColor: 'bg-green-500',
    //   textColor: 'text-green-600',
    //   bgColor: 'bg-green-50',
    //   icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />
    // },
    'New Booking Scheduled': {
      title: 'New Booking Scheduled',
      description: `A new appointment has been confirmed for ${notification.initiated_by} `,
      statusIcon: <CheckCircleIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />
    },
    'New Referral Booking Request': {
      title: `Referral Request: ${notification.initiated_by} → [${notification.member_name}]`,
      description: `${notification.initiated_by} has submitted a referral request for ${notification.member_name}`,
      statusIcon: <CalendarPlusIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      icon: <CalendarPlusIcon className="h-5 w-5 text-indigo-500" />
    },
    'Referral Appointment Confirmed': {
      title: `Referral Confirmed`,
      description: `Your referral appointment has been confirmed`,
      statusIcon: <CheckCircleIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />
    },
    'Appointment Cancelled': {
      title: 'Appointment Cancelled',
      description: `Your appointment has been cancelled`,
      statusIcon: <XCircleIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: <XCircleIcon className="h-5 w-5 text-red-500" />
    },
    'Appointment Rescheduled': {
      title: 'Reschedule Request',
      description: `Your appointment has been rescheduled`,
      statusColor: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      icon: <RefreshIcon className="h-5 w-5 text-amber-500" />
    },
    'Appointment Requested': {
      title: 'Appointment Requested',
      description: `Your appointment request has been submitted`,
      statusIcon: <CalendarPlusIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: <CalendarPlusIcon className="h-5 w-5 text-blue-500" />
    }
  };

  return (
    notificationTypes[notification.notification_type] || {
      title: notification.notification_type || 'Notification',
      description: `New notification from ${notification.initiated_by || 'system'}`,
      statusIcon: <InformationCircleIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: 'bg-gray-500',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
      icon: <InformationCircleIcon className="h-5 w-5 text-gray-500" />
    }
  );
};