import devYaml from './dev/env/index.yaml';
import prodYaml from './prod/env/index.yaml';
import testYaml from './test/env/index.yaml';
import uatYaml from './uat/env/index.yaml';

const environment = import.meta.env;
const currentEnv = environment?.MODE ?? 'dev';

export const EnvVariables = {
  dev: 'dev',
  uat: 'uat',
  prod: 'prod',
  test: 'test',
};

const getConfigs = () => {
  try {
    switch (currentEnv) {
      case EnvVariables.dev:
        return devYaml;
      case EnvVariables.uat:
        return uatYaml;
      case EnvVariables.test:
        return testYaml;
      case EnvVariables.prod:
        return prodYaml;
      default:
        return devYaml;
    }
  } catch (error) {
    console.error('Error loading config file:', error);
    return {};
  }
};

export default getConfigs();
