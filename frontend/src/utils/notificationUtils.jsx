import {
  CalendarPlusIcon,
  CheckCircleIcon,
  ExclamationIcon,
  InformationCircleIcon,
  RefreshIcon,
  PencilIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from "../components/icons/Icons";

export const getNotificationMeta = (notification,userType) => {
  const notificationTypes = {
    "New Booking Request": {
      title: "New Booking Request",
      description: `${notification.initiated_by} has made a new booking request`,
      statusIcon: <CalendarPlusIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      icon: <CalendarPlusIcon className="h-5 w-5 text-blue-500" />,
    },
    "New Booking Scheduled": {
      title: "New Booking Scheduled",
      description: `A new appointment has been confirmed for ${notification.initiated_by} `,
      statusIcon: <CheckCircleIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    },
    "Standard Appointment Confirmed": {
      title: "Appointment Confirmed",
      description: `Your appointment with ${notification.specialist_name} has been confirmed`,
      statusIcon: <CheckCircleIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    },
    "New Referral Booking Request": {
      title: `Referral Request: ${notification.initiated_by} → [${notification.member_name}]`,
      description: `${notification.initiated_by} has submitted a referral request for ${notification.member_name}`,
      statusIcon: <CalendarPlusIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: "bg-indigo-500",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      icon: <CalendarPlusIcon className="h-5 w-5 text-indigo-500" />,
    },
    "Referral Request Submitted": {
      title: "Referral Request Submitted",
      description: `Your referral request has been submitted to ${notification.specialist_name}`,
      statusIcon: <CalendarPlusIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: "bg-indigo-500",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      icon: <CalendarPlusIcon className="h-5 w-5 text-indigo-500" />,
    },
    "Referral Appointment Confirmed": {
      title: "Referral Appointment Confirmed",
      description: `Your referral appointment with ${notification.specialist_name} has been confirmed`,
      statusIcon: <CheckCircleIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    },
    "New Referral Booking Confirmed": {
      title: `Referral Confirmed: ${notification.initiated_by} → [${notification.member_name}]`,
      description: `${notification.initiated_by} has referred ${notification.member_name} to your care and secured the following appointment`,
      statusIcon: <CheckCircleIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    },
    "Appointment Cancelled": {
      title: "Appointment Cancelled",
      description:
        userType === "specialist"
          ? `${notification.initiated_by} (member) has cancelled the appointment`
          : `${notification.initiated_by} (specialist) has cancelled the appointment`,
      statusIcon: <XCircleIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: "bg-red-500",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
      icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
    },
    "Appointment Reschedule Requested": {
      title: "Reschedule Request",
      description: `${notification.initiated_by} has requested to reschedule the appointment`,
      statusColor: "bg-amber-500",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
      icon: <RefreshIcon className="h-5 w-5 text-amber-500" />,
    },
    "Appointment Rescheduled": {
      title: "Appointment Rescheduled",
      description:
        userType === "specialist"
          ? `${notification.initiated_by} (member) has rescheduled the appointment with you`
          : `Your appointment with ${notification.initiated_by} has been rescheduled`,
      statusColor: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      icon: <RefreshIcon className="h-5 w-5 text-blue-500" />,
    },
    "Appointment Requested": {
      title: "Appointment Requested",
      description: `Your appointment request has been submitted`,
      statusIcon: <CalendarPlusIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      icon: <CalendarPlusIcon className="h-5 w-5 text-blue-500" />,
    },
    "Appointment Details Updated": {
      title: "Appointment Details Updated",
      description: `${notification.initiated_by} (member) has updated their appointment details`,
      statusIcon: <PencilIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      icon: <PencilIcon className="h-5 w-5 text-purple-500" />,
    },
    "Appointment Missed": {
      title: "Appointment Marked Missed",
      description:`Your appointment with ${notification.specialist_name} was marked as missed`,
      statusIcon: <ExclamationCircleIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: "bg-red-500",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
      icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500" />,
    },
  };

  return (
    notificationTypes[notification.notification_type] || {
      title: notification.notification_type || "Notification",
      description: `New notification from ${
        notification.initiated_by || "system"
      }`,
      statusIcon: <InformationCircleIcon className="h-2.5 w-2.5 text-white" />,
      statusColor: "bg-gray-500",
      textColor: "text-gray-600",
      bgColor: "bg-gray-50",
      icon: <InformationCircleIcon className="h-5 w-5 text-gray-500" />,
    }
  );
};
