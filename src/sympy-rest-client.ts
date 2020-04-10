/**
 * @hidden
 * @packageDocumentation
 */
import { SympyErrorCode, SympyError, HttpClient } from "./model"; 


class SympyRequest {

  readonly method: string;
  readonly args: string[];
  readonly params?: any;

  constructor(method: string, args: string[], params?: any) {
    this.method = method;
    this.args = args;
    this.params = params;
  }
}

class SympyObjectRequest extends SympyRequest {

  readonly object: string;


  constructor(object: string, method: string, args: string[]) {
    super(method, args);
    this.object = object;
  }
}

class SympyResponce<T> {
  ok: boolean;
  result: T;
  error: string;
  errorCode: SympyErrorCode;
}

export class SympyRESTClient {
  private readonly CUSTOM = "/api/v1/custom";
  private readonly FUNCTION = "/api/v1/function";
  private readonly METHOD = "/api/v1/method";
  private readonly PLOT = "/api/v1/plot";

  private readonly http: HttpClient;
  private readonly serverAddress: string;

  constructor(serverAddress: string, http: HttpClient) {
    this.http = http;
    this.serverAddress = serverAddress;
  }

  plotSrc(method: string, args: string[], svg: boolean, params?: any, checkErrorOnly?: boolean): string {
    let ret = this.serverAddress + this.PLOT + "?method=" + method + "&args=" + encodeURIComponent(JSON.stringify(args));
    if (params) {
      ret += "&params=" + encodeURIComponent(JSON.stringify(params));
    }
    if (checkErrorOnly) {
      ret += "&checkOnly=true"
    }
    if (svg) {
      ret += "&format=svg"
    }
    return ret;
  }

  async checkPlotValidity(method: string, args: string[], svg: boolean, params?: any): Promise<boolean> {
    const self = this;
    const address = this.plotSrc(method, args, svg, params, true);
    console.log(address);
    return new Promise<boolean>((resolve, reject) => {
      self.http.requestAsync<void, SympyResponce<boolean>>('GET', address, null, (resp) => {
        if (resp.ok) {
          resolve(true);
        }
        else {
          reject(new SympyError(resp.errorCode, resp.error));
        }
      }, (err) => {
        reject(new SympyError(SympyErrorCode.CONNECTION_ERROR, "connection error"));
      });
    });
  }

  callFunction(name: string, args: string[], params?: any): Promise<string> {
    const self = this;
    return new Promise<string>((resolve, reject) => {
      self.http.requestAsync<SympyRequest, SympyResponce<string>>('POST', this.serverAddress + this.FUNCTION, new SympyRequest(name, args, params), (resp) => {
        if (resp.ok) {
          resolve(resp.result);
        }
        else {
          reject(new SympyError(resp.errorCode, resp.error));
        }
      }, (err) => {
        reject(new SympyError(SympyErrorCode.CONNECTION_ERROR, "connection error"));
      });
    });
  }

  callMethod(object: string, method: string, args: string[]): Promise<string> {
    const self = this;
    return new Promise<string>((resolve, reject) => {
      self.http.requestAsync<SympyObjectRequest, SympyResponce<string>>('POST', this.serverAddress + this.METHOD, new SympyObjectRequest(object, method, args), (resp) => {
        if (resp.ok) {
          resolve(resp.result);
        }
        else {
          reject(new SympyError(resp.errorCode, resp.error));
        }
      }, (err) => {
        reject(new SympyError(SympyErrorCode.CONNECTION_ERROR, "connection error"));
      });
    });
  }

  callCustom<T>(name: string, args: string[]): Promise<T> {
    const self = this;
    return new Promise<T>((resolve, reject) => {
      self.http.requestAsync<SympyRequest, SympyResponce<T>>('POST', this.serverAddress + this.CUSTOM, new SympyRequest(name, args), (resp) => {
        if (resp.ok) {
          resolve(resp.result);
        }
        else {
          reject(new SympyError(resp.errorCode, resp.error));
        }
      }, (err) => {
        reject(new SympyError(SympyErrorCode.CONNECTION_ERROR, "connection error"));
      });
    });
  }

}
