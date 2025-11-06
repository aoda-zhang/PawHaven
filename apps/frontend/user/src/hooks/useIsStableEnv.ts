import { useMemo } from 'react';

import envConfig, { EnvVariables } from '@/config';

/**
 * Hook to determine if the current environment is production-like.
 * Returns true for both production (prod) and testing (test) environments.
 */
const useIsStableEnv = (): boolean => {
  const isProdOrTest = useMemo(() => {
    const env = envConfig?.env;
    return [EnvVariables.test, EnvVariables.prod].includes(env);
  }, []);

  return isProdOrTest;
};

export default useIsStableEnv;
