import { HubConnectionState } from "@microsoft/signalr";

export type StateChangeCallbackType = (
  newState: HubConnectionState
) => void | Promise<void>;

export type GenericVoidCallbackType<T> = (payload: T) => void | Promise<void>;

export interface ISignalRClient {
  connectAsync: () => Promise<void>;
  on: <T>(event: string, callback: GenericVoidCallbackType<T>) => void;
  onStateChange: (callback: StateChangeCallbackType) => void;
  emitAsync: <T>(event: string, payload: T) => Promise<void>;
  closeAsync: () => Promise<void>;
}
