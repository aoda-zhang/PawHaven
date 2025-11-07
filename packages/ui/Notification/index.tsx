import designTokens from '@pawhaven/theme/designTokens';
import type { ReactElement } from 'react';
import React from 'react';
import type { ToastOptions } from 'react-hot-toast';
import toast, { Toaster } from 'react-hot-toast';

type ToasterProps = Partial<
  Pick<ToastOptions, 'position' | 'duration' | 'style' | 'iconTheme'>
>;
const notificationType = {
  success: 'success',
  error: 'error',
} as const;

export interface NotificationProps {
  success?: ToasterProps;
  error?: ToasterProps;
}

interface ShowNotificationProps {
  type?: keyof typeof notificationType;
  message: string | ReactElement;
  notificationOption?: ToasterProps;
}

export const showNotification = ({
  type = notificationType.error,
  message,
  notificationOption,
}: ShowNotificationProps) => {
  const globalNotificationID = 'PAWHAVEN_NOTIFICATION';
  toast.dismiss(globalNotificationID);
  switch (type) {
    case notificationType.success:
      toast.success(message, {
        id: globalNotificationID,
        ...(notificationOption ?? {}),
      });
      break;
    case notificationType.error:
      toast.error(message, {
        id: globalNotificationID,
        ...(notificationOption ?? {}),
      });
      break;

    default:
      toast.error(message, {
        id: globalNotificationID,
        ...(notificationOption ?? {}),
      });
  }
};

const Notification: React.FC<NotificationProps> = ({ success, error }) => {
  return (
    <Toaster
      toastOptions={{
        style: {
          maxWidth: '31.25rem',
          padding: '1rem',
        },
        success: {
          position: success?.position ?? 'top-center',
          style: success?.style ?? {
            backgroundColor: designTokens.colors.surface,
            color: designTokens.colors.success,
          },
          iconTheme: success?.iconTheme ?? {
            primary: designTokens.colors.success,
            secondary: designTokens.colors.surface,
          },
        },
        error: {
          position: error?.position ?? 'top-center',
          duration: error?.duration ?? Infinity,
          style: error?.style ?? {
            backgroundColor: designTokens.colors.error,
            color: designTokens.colors.surface,
          },
          iconTheme: error?.iconTheme ?? {
            primary: designTokens.colors.surface,
            secondary: designTokens.colors.error,
          },
        },
      }}
    />
  );
};
export default Notification;
