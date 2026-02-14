import { useEffect, useRef } from 'react';

export function useSync(dataTypes, onUpdate) {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    let ws;
    let reconnectTimer;

    function connect() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`);

      ws.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (dataTypes.includes(data.type)) {
            onUpdateRef.current();
          }
        } catch {
          // ignore malformed messages
        }
      });

      ws.addEventListener('close', () => {
        reconnectTimer = setTimeout(connect, 3000);
      });
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.close();
      }
    };
  }, [dataTypes]);
}
