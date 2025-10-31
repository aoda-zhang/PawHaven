import { Injectable } from '@nestjs/common';

@Injectable()
export class PawhavenService {
  constructor() {}

  login() {
    return {
      username: 'aoda',
    };
  }
}
