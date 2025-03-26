import { create } from "zustand";

interface SocketState {
  socketId: string;
  setSocketId: (socketId: string) => void;
  user: string;
  setUser: (user: string) => void;
}

const useSocketStore = create<SocketState>((set) => ({
  socketId: "",
  user: "",
  setSocketId: (socketId: string) => set({ socketId }),
  setUser: (user: string) => set({ user }),
}));

export default useSocketStore;
