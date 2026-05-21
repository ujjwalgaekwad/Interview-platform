import { create } from "zustand";

interface SocketState {
  user: string;
  setUser: (user: string) => void;
}

const useSocketStore = create<SocketState>((set) => ({
  user: "",
  setUser: (user: string) => set({ user }),
}));

export default useSocketStore;
