import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NodeType = {
  id: string;
  type: string;
  demand?: number;
  x: number;
  y: number;
};

export type Network = {
  id: string;
  name: string;
  nodes: NodeType[];
  edges: any[];
  alerts?: any[];
  pressures?: Record<string, Record<string, number>>;
};

type NetworkStore = {
  networks: Network[];
  activeNetworkId: string | null;

  addNetwork: (n: Network) => void;
  setActiveNetwork: (id: string) => void;
  updateNodeDemand: (
    networkId: string,
    nodeId: string,
    demand: number
  ) => void;

  deleteNetwork: (networkId: string) => void;   // 🔥 NEW

  getActiveNetwork: () => Network | null;
};

export const useNetworkStore = create<NetworkStore>()(
  persist(
    (set, get) => ({
      networks: [],
      activeNetworkId: null,

      addNetwork: (network) =>
        set((state) => ({
          networks: [...state.networks, network],
          activeNetworkId: network.id,
        })),

      setActiveNetwork: (id) =>
        set({ activeNetworkId: id }),

      updateNodeDemand: (networkId, nodeId, demand) =>
        set((state) => ({
          networks: state.networks.map((net) =>
            net.id !== networkId
              ? net
              : {
                  ...net,
                  nodes: net.nodes.map((n) =>
                    n.id === nodeId
                      ? { ...n, demand }
                      : n
                  ),
                }
          ),
        })),

      // 🔥 DELETE NETWORK
      deleteNetwork: (networkId) =>
        set((state) => {
          const filtered = state.networks.filter(
            (n) => n.id !== networkId
          );

          return {
            networks: filtered,
            activeNetworkId:
              state.activeNetworkId === networkId
                ? filtered[0]?.id ?? null
                : state.activeNetworkId,
          };
        }),

      getActiveNetwork: () => {
        const { networks, activeNetworkId } = get();
        return (
          networks.find((n) => n.id === activeNetworkId) ||
          null
        );
      },
    }),
    { name: 'wdn-networks-store' }
  )
);
