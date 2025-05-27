export interface Device  {
    deviceId: number;
    deviceName: string;
    deviceIP: string;
    isActive: boolean;
    devicePort: string;
    deviceDirection: string;
    serialNo: string;
    conStatus:string;
  };

  export interface sample {
    sampleId : string;
    sampleName : string;
  }