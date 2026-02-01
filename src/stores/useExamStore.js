import { create } from "zustand";

export const useExamStore = create((set) => ({
    charAnime: "Idle",
    computerAciont: false,
    treeAction: false,

    setCharAnime: (value) => set(({charAnime: value})) ,
    setComAction: (value) => set(({computerAciont: value})),
    setTreeAction: (value) => set(({treeAction: value})),
}))