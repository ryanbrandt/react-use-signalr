import { renderHook } from "@testing-library/react-hooks";
import { HubConnectionState } from "@microsoft/signalr";

import { useSignalRClient } from "hooks";
import SignalRClient from "client";
import { UseSignalRClientReturnType } from "types";

jest.mock("client");
const mockedSignalRClient = SignalRClient as jest.MockedClass<
  typeof SignalRClient
>;
const mockClient = {
  connectAsync: jest.fn(),
  closeAsync: jest.fn(),
  emitAsync: jest.fn(),
  onStateChange: jest.fn(),
  on: jest.fn(),
};
// @ts-ignore
mockedSignalRClient.mockImplementation(() => ({
  ...mockClient,
}));

describe("useSignalRClient", () => {
  const MOCK_URL = "http://foo.com/ws/mock";
  it("returns the connection state a connected ILimitedSignalRClient instance", () => {
    const {
      result: { all: renderHookResult },
    } = renderHook<void, UseSignalRClientReturnType>(() =>
      useSignalRClient(MOCK_URL)
    );

    const [state, client] = renderHookResult[0] as UseSignalRClientReturnType;

    expect(state).toBe(HubConnectionState.Connecting);

    expect(client.on).toEqual(mockClient.on);
    expect(client.emitAsync).toEqual(mockClient.emitAsync);

    expect(mockedSignalRClient).toHaveBeenCalledTimes(1);
    expect(mockedSignalRClient).toHaveBeenCalledWith(MOCK_URL);
    expect(mockClient.connectAsync).toHaveBeenCalledTimes(1);
  });
});
