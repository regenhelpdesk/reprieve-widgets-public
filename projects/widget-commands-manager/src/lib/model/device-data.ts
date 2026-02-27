import { DeviceDataProp } from './device-data-prop';

export class DeviceData {
  data: { [key: string]: DeviceDataProp};
  deviceDataId: string;
  deviceId: string;
  maxValueProvidedOn: string;
  minValueProvidedOn: string;
  ownerId: string;
  owner: Object;
}
