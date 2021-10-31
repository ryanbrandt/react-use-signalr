import { useEffect, useState } from "react";

import { ILimitedSignalRClient } from "types";

export const useSignalRMethodLatest = <T>(
  client: ILimitedSignalRClient,
  method: string
): T => {
  const [methodLatest, setMethodLatest] = useState<T>();

  useEffect(() => {
    client.on<T>(method, (payload: T) => {
      setMethodLatest(payload);
    });
  }, []);

  return methodLatest;
};
