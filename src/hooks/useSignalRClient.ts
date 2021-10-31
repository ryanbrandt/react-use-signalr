import { useCallback, useEffect, useRef, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";

import SignalRClient from "client";
import { UseSignalRClientReturnType } from "types";
import { ISignalRClient } from "types/client";

export const useSignalRClient = (
  hubUrl: string
): UseSignalRClientReturnType => {
  const clientRef = useRef<ISignalRClient>();

  const [connectionState, setConnectionState] = useState<HubConnectionState>(
    HubConnectionState.Connecting
  );

  useEffect(() => {
    let ignore = false;

    const signalRClient = new SignalRClient(hubUrl);
    clientRef.current = signalRClient;

    signalRClient.connectAsync();

    signalRClient.onStateChange((newState) => {
      useCallback(() => {
        if (!ignore) {
          setConnectionState(newState);
        }
      }, [newState]);
    });

    return () => {
      ignore = true;
      signalRClient.closeAsync();
    };
  }, []);

  return [
    connectionState,
    {
      on: clientRef.current?.on,
      emitAsync: clientRef.current?.emitAsync,
    },
  ];
};
