# react-use-signalr

A React hooks API for a better SignalR experience

## API

### useSignalRClient

Provides a basic interface for interacting with a single SignalR Hub.

Example Usage:

```tsx
// SomeComponent.tsx

const [state, client] = useSignalRClient("https://my-api.com/ws/message");

const doBar = (fooPayload: { foo: string }): void => {
  client.emitAsync("bar", fooPayload);
};

client.on<{ foo: string }>("foo", (fooPayload) => {
  doBar(fooPayload);
});

if (state === "connected") {
  return <MyComponent />;
}

return <div>Not connected!</div>;
```

### useSignalRMethodChannel

A simple extension upon `useSignalRClient` which provides a list of all data broadcasted under a given method name.

Example Usage:

```tsx
// SomeComponent.tsx

const [state, client] = useSignalRClient("https://my-api.com/ws/message");

// messages will accumulate all data broadcasted under the
// newMessage method, triggering a re-render whenever
// new data is received
const messages = useSignalRMethodChannel(client, "newMessage");

return messages.map((m) => <MessageDisplay message={m} />);
```

### useSignalRMethodLatest

A simple extension upon `useSignalRClient` which provides the latest data point broadcasted under a given method name.

Example Usage:

```tsx
// SomeComponent.tsx

const [state, client] = useSignalRClient("https://my-api.com/ws/stock");

// stockPrice will always contain the latest data point broadcasted
// under the newPrice method, triggering a re-render whenever
// new data is received
const stockPrice = useSignalRMethodLatest(client, "newPrice");

return <StockPriceDisplay price={stockPrice}>
```
