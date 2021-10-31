import { useEffect, useState } from "react";

import { ILimitedSignalRClient } from "../types";

export const useSignalRMethodChannel = <T>(
  client: ILimitedSignalRClient,
  method: string
): Array<T> => {
  const [methodChannelData, setMethodChannelData] = useState<Array<T>>([]);

  useEffect(() => {
    client.on<T>(method, (payload: T) => {
      setMethodChannelData([...methodChannelData, payload]);
    });
  }, []);

  return methodChannelData;
};
