import { create } from "zustand";

export const useDiceGameStore = create((set) => ({
    diceCount: 5,       // 주사위 갯수
    diceValues: [],     // 결과값 배열
    rollTrigger: 0,     // 굴리기 신호주기용 숫자

    rollDice: () => set((state) => ({       //주사위 굴리기 눌렀을때 실행
        rollTrigger: state.rollTrigger + 1,
        diceValues: Array(state.diceCount).fill(null)
    })),
    //주사위가 멈췄을때 결과 기록하는 함수
    setDiceResult: (index, value) => set((state) => {
        const newValues = [...state.diceValues];
        newValues[index] = value;
        return { diceValues: newValues }
    })
}))