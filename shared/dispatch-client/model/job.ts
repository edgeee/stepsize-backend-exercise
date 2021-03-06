/**
 * Dispatch API
 * Generated with `routing-controllers-openapi`
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export class Job {
    'complexity': number;
    'completedAt'?: string;
    'status': Job.StatusEnum;
    'id': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "complexity",
            "baseName": "complexity",
            "type": "number"
        },
        {
            "name": "completedAt",
            "baseName": "completedAt",
            "type": "string"
        },
        {
            "name": "status",
            "baseName": "status",
            "type": "Job.StatusEnum"
        },
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return Job.attributeTypeMap;
    }
}

export namespace Job {
    export enum StatusEnum {
        Pending = <any> 'Pending',
        Processing = <any> 'Processing',
        Completed = <any> 'Completed',
        Failed = <any> 'Failed'
    }
}
