// No need Sign validation
import type { CustomDecorator } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Decorators } from '@shared/constants/enum';

const NoSign = (): CustomDecorator<Decorators> =>
  SetMetadata(Decorators.noSign, true);
export default NoSign;
