import { useTranslation } from 'react-i18next';
import type { NavigateFunction } from 'react-router-dom';

const Brand = ({ navigate }: { navigate: NavigateFunction }) => {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-row items-center gap-3 cursor-pointer mr-auto"
      onClick={() => {
        navigate('/');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate('/');
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={t('common.name')}
    >
      <img
        src="/images/logo.png"
        alt={t('common.slogan')}
        className="w-38 lg:w-46 h-auto"
      />
    </div>
  );
};
export default Brand;
