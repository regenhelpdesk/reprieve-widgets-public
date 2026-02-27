import { Practice } from "./practice";
import {
    PROP_CODE_INSTRUMENT_SW_VERSION, PROP_CODE_INSTRUMENT_BACKLIGHT_BRIGHTNESS, PROP_CODE_INSTRUMENT_AUTO_LOGOUT_TIME,
    PROP_CODE_INSTRUMENT_AUTO_SLEEP_TIME, PROP_CODE_INSTRUMENT_NAME, PROP_CODE_INSTRUMENT_HOST_NAME, PROP_CODE_INSTRUMENT_TIMEZONE,
    PROP_CODE_SITE_ID, PROP_CODE_INSTRUMENT_TARGET_VERSION,
    PROP_CODE_INSTRUMENT_MAINTAINER_PASSWORD
  } from './contstant';

export class DeviceInstance {
    deviceInstanceId: string;
    identifier: string;
    firmwareVersion: string;
    status: string;
    state: string;
    currentAssociation: DeviceInstanceAssociation;

    createdOn: string;
    createdBy: string;
    lastUpdatedOn: string;
    lastUpdateBy: string;
    lastCommunicationOn: string;

    name: string;
    softwareVersion: string;
    targetVersion: string;
    hostName: string;
    backlightBrightness: number;
    autoLogoutTime: number;
    autosleepTime: number;
    timezone: string;
    maintainerPassword: string;
    siteId: string;
    site: Practice;
    dateAdded: Date;
    deviceDataId: string;

    public static fromCloud(deviceInstanceValue: any, deviceInstance: DeviceInstance = null): DeviceInstance {
        if (!deviceInstanceValue) {
            return null;
        }
        let deviceInstanceToUse = deviceInstance;
        if (!deviceInstanceToUse) {
            deviceInstanceToUse = new DeviceInstance();
        }
        if (deviceInstanceValue.deviceInstanceId) {
            deviceInstanceToUse.deviceInstanceId = deviceInstanceValue.deviceInstanceId;
        }
        if (deviceInstanceValue.identifier) {
            deviceInstanceToUse.identifier = deviceInstanceValue.identifier;
        }
        if (deviceInstanceValue.firmwareVersion) {
            deviceInstanceToUse.firmwareVersion = deviceInstanceValue.firmwareVersion;
        }
        if (deviceInstanceValue.status) {
            deviceInstanceToUse.status = deviceInstanceValue.status;
        }
        if (deviceInstanceValue.state) {
            deviceInstanceToUse.state = deviceInstanceValue.state;
        }
        if (deviceInstanceValue.currentAssociation) {
            deviceInstanceToUse.currentAssociation = DeviceInstanceAssociation.fromCloud(deviceInstanceValue.currentAssociation);
        }
        if (deviceInstanceValue.createdOn) {
            let createdOnStr = deviceInstanceValue.createdOn as string;
            if (!createdOnStr.toLowerCase().endsWith('z')) {
                createdOnStr += 'Z'; // server timestamps are always UTC, but may not contain the Z at the end, that is needed
                                     // to parse in Javascript properly as UTC
            }
            deviceInstanceToUse.dateAdded = new Date(createdOnStr);
        }
        if (deviceInstanceValue.createdBy) {
            deviceInstanceToUse.createdBy = deviceInstanceValue.createdBy;
        }
        if (deviceInstanceValue.lastUpdatedOn) {
            deviceInstanceToUse.lastUpdatedOn = deviceInstanceValue.lastUpdatedOn;
        }
        if (deviceInstanceValue.lastUpdateBy) {
            deviceInstanceToUse.lastUpdateBy = deviceInstanceValue.lastUpdateBy;
        }
        if (deviceInstanceValue.lastCommunicationOn) {
            deviceInstanceToUse.lastCommunicationOn = deviceInstanceValue.lastCommunicationOn;
        }

        return deviceInstanceToUse;
    }

    public static fromDeviceData(deviceData, deviceInstance: DeviceInstance = null): DeviceInstance {
        if (!deviceData) {
            return null;
        }
        let deviceInstanceToUse = deviceInstance;
        if (!deviceInstanceToUse) {
            deviceInstanceToUse = new DeviceInstance();
        }
        deviceInstanceToUse.deviceDataId = deviceData.deviceDataId;
        if (deviceData.data[PROP_CODE_INSTRUMENT_SW_VERSION]) {
            deviceInstanceToUse.softwareVersion = deviceData.data[PROP_CODE_INSTRUMENT_SW_VERSION].value;
        }
        if (deviceData.data[PROP_CODE_INSTRUMENT_BACKLIGHT_BRIGHTNESS]) {
            deviceInstanceToUse.backlightBrightness = deviceData.data[PROP_CODE_INSTRUMENT_BACKLIGHT_BRIGHTNESS].value;
        }
        if (deviceData.data[PROP_CODE_INSTRUMENT_AUTO_LOGOUT_TIME] != null && deviceData.data[PROP_CODE_INSTRUMENT_AUTO_LOGOUT_TIME] !== undefined) {
            deviceInstanceToUse.autoLogoutTime = deviceData.data[PROP_CODE_INSTRUMENT_AUTO_LOGOUT_TIME].value / 60;
        }
        if (deviceData.data[PROP_CODE_INSTRUMENT_AUTO_SLEEP_TIME] != null && deviceData.data[PROP_CODE_INSTRUMENT_AUTO_SLEEP_TIME] !== undefined) {
            deviceInstanceToUse.autosleepTime = deviceData.data[PROP_CODE_INSTRUMENT_AUTO_SLEEP_TIME].value / 60;
        }
        if (deviceData.data[PROP_CODE_INSTRUMENT_NAME]) {
            deviceInstanceToUse.name = deviceData.data[PROP_CODE_INSTRUMENT_NAME].value;
        }
        if (deviceData.data[PROP_CODE_INSTRUMENT_HOST_NAME]) {
            deviceInstanceToUse.hostName = deviceData.data[PROP_CODE_INSTRUMENT_HOST_NAME].value;
        }
        if (deviceData.data[PROP_CODE_INSTRUMENT_TIMEZONE]) {
            deviceInstanceToUse.timezone = deviceData.data[PROP_CODE_INSTRUMENT_TIMEZONE].value;
        }
        if (deviceData.data[PROP_CODE_SITE_ID]) {
            deviceInstanceToUse.siteId = deviceData.data[PROP_CODE_SITE_ID].value;
        }
        if (deviceData.data[PROP_CODE_INSTRUMENT_MAINTAINER_PASSWORD]) {
            deviceInstanceToUse.maintainerPassword = deviceData.data[PROP_CODE_INSTRUMENT_MAINTAINER_PASSWORD].value;
        }
        if (deviceData.data[PROP_CODE_INSTRUMENT_TARGET_VERSION]) {
            deviceInstanceToUse.targetVersion = deviceData.data[PROP_CODE_INSTRUMENT_TARGET_VERSION].value;
        }
        return deviceInstanceToUse;
    }

    public static toEditableSet1(deviceInstance: DeviceInstance): Map<string, any> {
        const data = new Map<string, any>();
        if (deviceInstance.softwareVersion != null && deviceInstance.softwareVersion !== undefined) {
            data.set(PROP_CODE_INSTRUMENT_SW_VERSION, deviceInstance.softwareVersion);
        }
        if (deviceInstance.backlightBrightness != null && deviceInstance.backlightBrightness !== undefined) {
            data.set(PROP_CODE_INSTRUMENT_BACKLIGHT_BRIGHTNESS, deviceInstance.backlightBrightness);
        }
        if (deviceInstance.autoLogoutTime != null && deviceInstance.autoLogoutTime !== undefined) {
            data.set(PROP_CODE_INSTRUMENT_AUTO_LOGOUT_TIME, deviceInstance.autoLogoutTime * 60);
        }
        if (deviceInstance.autosleepTime != null && deviceInstance.autosleepTime !== undefined) {
            data.set(PROP_CODE_INSTRUMENT_AUTO_SLEEP_TIME, deviceInstance.autosleepTime * 60);
        }
        if (deviceInstance.siteId != null && deviceInstance.site !== undefined) {
            data.set(PROP_CODE_SITE_ID, deviceInstance.siteId);
        }
        return data;
    }

    public static toEditableSet2(deviceInstance: DeviceInstance): Map<string, any> {
        const data = new Map<string, any>();
        if (deviceInstance.name != null && deviceInstance.name !== undefined) {
            data.set(PROP_CODE_INSTRUMENT_NAME, deviceInstance.name);
        }
        if (deviceInstance.hostName != null && deviceInstance.hostName !== undefined) {
            data.set(PROP_CODE_INSTRUMENT_HOST_NAME, deviceInstance.hostName);
        }
        if (deviceInstance.timezone != null && deviceInstance.timezone !== undefined) {
            data.set(PROP_CODE_INSTRUMENT_TIMEZONE, deviceInstance.timezone);
        }
        return data;
    }

    public static toEditableSet3(deviceInstance: DeviceInstance): Map<string, any> {
        const data = new Map<string, any>();
        if (deviceInstance.targetVersion != null && deviceInstance.targetVersion !== undefined) {
            data.set(PROP_CODE_INSTRUMENT_TARGET_VERSION, deviceInstance.targetVersion);
        }
        return data;
    }

}

export class DeviceInstanceAssociation {
    deviceInstanceAssociationId: string;
    ownerId: string;
    owner: any;
    ownerType: string;
    status: string;

    createdOn: string;
    createdBy: string;
    lastUpdatedOn: string;
    lastUpdateBy: string;

    public static fromCloud(deviceInstanceAssociationValue: any): DeviceInstanceAssociation {
        if (!deviceInstanceAssociationValue) {
            return null;
        }
        const deviceInstanceAssociation = new DeviceInstanceAssociation();
        if (deviceInstanceAssociationValue.deviceInstanceAssociationId) {
            deviceInstanceAssociation.deviceInstanceAssociationId = deviceInstanceAssociationValue.deviceInstanceAssociationId;
        }
        if (deviceInstanceAssociationValue.ownerId) {
            deviceInstanceAssociation.ownerId = deviceInstanceAssociationValue.ownerId;
        }
        if (deviceInstanceAssociationValue.owner) {
            deviceInstanceAssociation.owner = deviceInstanceAssociationValue.owner;
        }
        if (deviceInstanceAssociationValue.ownerType) {
            deviceInstanceAssociation.ownerType = deviceInstanceAssociationValue.ownerType;
        }
        if (deviceInstanceAssociationValue.status) {
            deviceInstanceAssociation.status = deviceInstanceAssociationValue.status;
        }
        if (deviceInstanceAssociationValue.createdOn) {
            deviceInstanceAssociation.createdOn = deviceInstanceAssociationValue.createdOn;
        }
        if (deviceInstanceAssociationValue.createdBy) {
            deviceInstanceAssociation.createdBy = deviceInstanceAssociationValue.createdBy;
        }
        if (deviceInstanceAssociationValue.lastUpdatedOn) {
            deviceInstanceAssociation.lastUpdatedOn = deviceInstanceAssociationValue.lastUpdatedOn;
        }
        if (deviceInstanceAssociationValue.lastUpdateBy) {
            deviceInstanceAssociation.lastUpdateBy = deviceInstanceAssociationValue.lastUpdateBy;
        }
        return deviceInstanceAssociation;
    }

}