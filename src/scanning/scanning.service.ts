import { Injectable } from '@nestjs/common';

@Injectable()
export class ScanningService {
  async scan(): Promise<void> {
    console.log('scan');
  }
}
