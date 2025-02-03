import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { Message } from "@/pages/chat";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      path: "/api/socket.io",
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return socket;
}
