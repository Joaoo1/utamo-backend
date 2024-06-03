import crypto from 'crypto';
import { IUUID } from './IUUID';

export class UUID implements IUUID {
  generate() {
    return crypto.randomUUID();
  }

  validate(uuid: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      uuid
    );
  }
}
