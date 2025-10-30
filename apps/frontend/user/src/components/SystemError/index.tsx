import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

const SystemError = () => {
  const { t } = useTranslation();

  const goToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col items-center gap-2 justify-center text-lg my-8">
      <img
        src="/images/500.png"
        alt="System error"
        className="max-w-1/4 h-auto mb-10"
      />
      <p>{t('common.system_error')}</p>
      <p>{t('common.system_error_info')}</p>
      <Button
        type="button"
        variant="contained"
        onClick={goToHome}
        className="px-4 py-2 bg-primary rounded-lg hover:bg-primary transition-colors duration-300"
      >
        {t('common.go_to_home')}
      </Button>
    </div>
  );
};

export default SystemError;
