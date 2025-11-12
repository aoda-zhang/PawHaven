import { Alert, AlertTitle, Link, Collapse, IconButton } from '@mui/material';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface BannerMessage {
  id: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  message: string;
  linkText?: string;
  linkUrl?: string;
  dismissible?: boolean;
}

export const NotificationBanner: React.FC<{ banner: BannerMessage }> = ({
  banner,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <Collapse in={open}>
      <Alert
        severity={banner.type ?? 'info'}
        sx={{
          borderRadius: 0,
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: '0.95rem',
          py: 1.2,
        }}
        action={
          banner.dismissible ? (
            <IconButton size="small" onClick={() => setOpen(false)}>
              <X />
            </IconButton>
          ) : null
        }
      >
        {banner.title && (
          <AlertTitle
            sx={{
              fontSize: '1.25rem',
              textAlign: 'left',
            }}
          >
            {t(banner.title)}
          </AlertTitle>
        )}
        <p className="text-left">{t(banner.message)}</p>
        {banner.linkText && banner.linkUrl && (
          <>
            <Link href={banner.linkUrl} target="_blank" underline="hover">
              {t(banner.linkText)}
            </Link>
          </>
        )}
      </Alert>
    </Collapse>
  );
};
