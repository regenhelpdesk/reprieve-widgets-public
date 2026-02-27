import { ContactInfo } from './contact-info';

export class Supplier {
  supplierId: string;
  name: string;
  contactInfo: ContactInfo;
  createdBy: string;
  createdOn: string;
  emailAddress: string;
  lastUpdatedBy: string;
  lastUpdatedOn: string;
  status: string;
  Enum: 'Active' | 'Inactive' | 'Pending';

  tenantId: string;

  constructor() {
    this.supplierId = crypto.randomUUID();
    this.contactInfo = new ContactInfo();
  }

  static getAddress(supplier: Supplier): string {
    if (!supplier || !supplier.contactInfo) {
      return '';
    }
    return supplier.contactInfo.streetAddress1 + ', '
      + supplier.contactInfo.city + ' '
      + supplier.contactInfo.state + ' '
      + supplier.contactInfo.zipcode + ', '
      + supplier.contactInfo.country
  }
}

