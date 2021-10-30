import { useEffect, useRef, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";

import SignalRClient from "../client";
import { ISignalRClient } from "../types";

export interface ISignalRChannelClient<U> {
  state: HubConnectionState;
  pushAsync: (payload: U) => Promise<void>;
}

export type UseSignalRChannelReturnType<T, U> = [
  Array<T>,
  ISignalRChannelClient<U>
];

/**
 * Simple hook which provides an API for sending and receiving data
 * within a single SignalR hub method stream.
 *
 * For example, useSignalRChannel("{api}/ws/messages", "sendMessage") will
 * establish a WS connection with the SignalR hub at {api}/ws/messages and provide all data pushed
 * with the sendMessage method as well as a client to push to data with the sendMessage method.
 *
 * @param url The url of the desired SignalR hub
 * @param channel The SignalR method/event of interest
 */
export const useSignalRChannel = <T, U>(
  url: string,
  channel: string
): UseSignalRChannelReturnType<T, U> => {
  const [wsState, setWsState] = useState<HubConnectionState>(
    HubConnectionState.Connecting
  );
  const [channelData, setChannelData] = useState<Array<T>>([]);

  const clientRef = useRef<ISignalRClient>();

  useEffect(() => {
    let ignore = false;

    const signalRClient = new SignalRClient(url);
    clientRef.current = signalRClient;

    signalRClient.onStateChange((newState) => {
      if (!ignore) {
        setWsState(newState);
      }
    });

    signalRClient.on<T>(channel, (payload: T) => {
      if (!ignore) {
        setChannelData([...channelData, payload]);
      }
    });

    signalRClient.connectAsync();

    return () => {
      signalRClient.closeAsync();
      ignore = true;
    };
  }, []);

  const pushAsync = async (payload: U): Promise<void> => {
    if (clientRef.current) {
      await clientRef.current.emitAsync(channel, payload);
    }
  };

  return [channelData, { state: wsState, pushAsync }];
};
