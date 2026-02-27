export class ContactInfo {
  city: string;
  country: string;
  primaryPhone: string;
  secondaryPhone: string;
  state: string;
  streetAddress1: string;
  streetAddress2: string;
  zipcode: string;

  public static toFormattedAddress(contactInfo: ContactInfo): string {
    return contactInfo.streetAddress1 + ', ' + contactInfo.city + ', ' + contactInfo.state + ' ' + contactInfo.country + ', ' + contactInfo.zipcode;
  }
}
