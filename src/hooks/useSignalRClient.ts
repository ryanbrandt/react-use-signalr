import { useCallback, useEffect, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";

import SignalRClient from "client";
import { UseSignalRClientReturnType } from "types";

export const useSignalRClient = (
  hubUrl: string
): UseSignalRClientReturnType => {
  const [connectionState, setConnectionState] = useState<HubConnectionState>(
    HubConnectionState.Connecting
  );

  const signalRClient = new SignalRClient(hubUrl);

  useEffect(() => {
    let ignore = false;

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
      on: signalRClient.on,
      emitAsync: signalRClient.emitAsync,
    },
  ];
};
