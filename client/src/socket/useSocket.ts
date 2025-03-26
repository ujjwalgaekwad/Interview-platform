import { useContext } from "react";
import { SocketContext } from "./SocketContext"; // Import the SocketContext

const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider"); // Error handling if used outside provider
  }
  return socket;
};

export default useSocket; 
