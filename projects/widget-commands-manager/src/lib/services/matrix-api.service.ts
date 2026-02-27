import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';

/**
 * Shared service for core Matrix API requests.
 * Can be used by all widgets that need to interact with device instances.
 */
@Injectable({
  providedIn: 'root'
})
export class MatrixApiService {

  private API = 'https://api.galencloud.com';

  constructor(private http: HttpClient) { }

  /**
   * Fetches device instances from the Matrix API
   * @param deviceId Device type ID to filter by
   * @param identifierLike Optional identifier filter
   * @param status Optional status filter
   * @param state Optional state filter
   * @param pageSize Items per page (-1 for all)
   * @param pageNumber Zero-based page number
   * @param sortBy Field to sort by
   * @param sortOrder 'ASC' or 'DESC'
   */
  getDeviceInstances(
    deviceId: string,
    identifierLike: string = null,
    status: string = null,
    state: string = null,
    pageSize = -1,
    pageNumber = 0,
    sortBy = 'identifier',
    sortOrder = 'ASC'
  ): Observable<Page<any>> {
    const params = new URLSearchParams();
    params.set('deviceId', deviceId);
    if (identifierLike) {
      params.set('identifier', identifierLike);
    }
    if (status) {
      params.set('status', status);
    }
    if (state) {
      params.set('state', state);
    }
    params.set('pageNumber', '' + pageNumber);
    if (pageSize > 0) {
      params.set('pageSize', '' + pageSize);
    }
    if (sortBy != null) {
      params.set('sortBy', sortBy);
    }
    params.set('sortOrder', sortOrder);
    return this.http.get<Page<any>>(`${this.API}/device/instance/currentlink?${params.toString()}`);
  }

  /**
   * Fetches a single device instance by ID
   */
  getDeviceInstance(deviceInstanceId: string): Observable<any> {
    return this.http.get<any>(`${this.API}/device/instance/currentlink/${deviceInstanceId}`);
  }

  /**
   * Fetches device instances and maps them to a simplified Device structure
   * suitable for widget consumption.
   */
  async fetchDevicesForWidget(deviceId: string): Promise<DeviceInstanceSimple[]> {
    try {
      const page = await lastValueFrom(
        this.getDeviceInstances(deviceId, null, null, null, 1000, 0, 'identifier', 'ASC')
      );

      return page.content.map(item => ({
        deviceInstanceId: item.deviceInstanceId,
        identifier: item.identifier
      }));
    } catch (error) {
      console.error('Error fetching devices:', error);
      return [];
    }
  }

  /**
   * Posts device data to the Matrix API.
   * Generic method for saving data to device data models.
   *
   * @param request Device data save request body
   * @returns Observable that emits the device data ID as a string
   */
  postDeviceData(request: DeviceDataSaveRequestBody): Observable<string> {
    return this.http.post(`${this.API}/data/devicedata`, request, {
      responseType: 'text'
    });
  }
}

/**
 * Page response structure from Matrix API
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * Simplified device structure for widget use
 */
export interface DeviceInstanceSimple {
  deviceInstanceId: string;
  identifier: string;
}

/**
 * Device data save request body structure
 */
export interface DeviceDataSaveRequestBody {
  /** The identifier of the device data model */
  deviceDataModelId: string;
  /** The identifier of the device property set */
  devicePropertySetId: string;
  /** The identifier of the device data (optional, null for new data) */
  deviceDataId?: string | null;
  /** The identifier of the owner (optional) */
  ownerId?: string | null;
  /** The data dictionary with property code as key and value as value */
  data: { [key: string]: any };
}
