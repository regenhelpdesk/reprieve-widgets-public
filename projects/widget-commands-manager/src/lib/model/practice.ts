import { ContactInfo } from './contact-info';

export class Practice {
  practiceId: string;
  name: string;
  contactInfo: ContactInfo;
  createdBy: string;
  createdOn: string;
  emailAddress: string;
  lastUpdatedBy: string;
  lastUpdatedOn: string;
  status: string;
  supplierId: string;
  tenantId: string;

  timezone?: string;

  constructor() {
    this.contactInfo = new ContactInfo();
  }

  static getAddress(practice: Practice): string {
    if (!practice || !practice.contactInfo) {
      return '';
    }
    return practice.contactInfo.streetAddress1 + ', '
      + practice.contactInfo.city + ' '
      + practice.contactInfo.state + ' '
      + practice.contactInfo.zipcode + ', '
      + practice.contactInfo.country
  }
}
