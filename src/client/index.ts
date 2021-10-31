import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  HttpTransportType,
  LogLevel,
} from "@microsoft/signalr";

import {
  StateChangeCallbackType,
  ISignalRClient,
  GenericVoidCallbackType,
} from "../types/client";

class SignalRClient implements ISignalRClient {
  private _wsConnection: HubConnection;
  private _stateChangeHandler?: StateChangeCallbackType;

  constructor(url: string) {
    this._wsConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Debug)
      .withUrl(url, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .build();

    this._wsConnection.onclose(() =>
      this._handleStateChange(HubConnectionState.Disconnected)
    );
    this._wsConnection.onreconnected(() =>
      this._handleStateChange(HubConnectionState.Connected)
    );
    this._wsConnection.onreconnecting(() =>
      this._handleStateChange(HubConnectionState.Reconnecting)
    );
  }

  private _handleStateChange = (newState: HubConnectionState): void => {
    if (this._stateChangeHandler) {
      this._stateChangeHandler(newState);
    }
  };

  connectAsync = async (): Promise<void> => {
    await new Promise((resolve, reject) => {
      this._wsConnection
        .start()
        .then(() => {
          this._handleStateChange(this._wsConnection.state);
          resolve(this._wsConnection.state);
        })
        .catch((e) => reject(e));
    });
  };

  on = <T>(event: string, callback: GenericVoidCallbackType<T>): void => {
    this._wsConnection.on(event, callback);
  };

  onStateChange = (callback: StateChangeCallbackType): void => {
    this._stateChangeHandler = callback;
  };

  emitAsync = async <T>(event: string, payload: T): Promise<void> => {
    await this._wsConnection.send(event, payload);
  };

  closeAsync = async (): Promise<void> => {
    await this._wsConnection.stop();
  };
}

export default SignalRClient;
