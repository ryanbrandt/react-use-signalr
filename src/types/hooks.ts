import { HubConnectionState } from "@microsoft/signalr";

import { ISignalRClient } from "./client";

export interface ILimitedSignalRClient
  extends Pick<ISignalRClient, "on">,
    Pick<ISignalRClient, "emitAsync"> {}

export type UseSignalRClientReturnType = [
  HubConnectionState,
  ILimitedSignalRClient
];
