import { create } from "zustand";

export const useDiceGameStore = create((set) => ({
    diceCount: 5,       // 주사위 갯수
    diceValues: [],     // 결과값 배열
    keeps: [false, false, false, false, false], // 고정상태 배열
    rollCount: 3, // 굴릴 수 있는 횟수
    rollTrigger: 0,     // 굴리기 신호주기용 숫자
    isReturningToGlass: false,  //잔에 넣는 boolean
    
    rollDice: () => set((state) => {    // 주사위 굴리기 눌렀을때 실행
        if(state.rollCount <= 0) return state;
        return{
            rollTrigger: state.rollTrigger + 1,
            rollCount: state.rollCount - 1,
            diceValues: Array(state.diceCount).fill(null)
        };
    }),
    setDiceResult: (index, value) => set((state) => { //주사위가 멈췄을때 결과 기록하는 함수
        const newValues = [...state.diceValues];
        newValues[index] = value;
        return { diceValues: newValues }
    }),
    toggleKeep: (index) => set((state) => {    //주사위 킵하는 함수
        const newKeeps = [...state.keeps];
        newKeeps[index] = !newKeeps[index];
        return {keeps: newKeeps};
    }),
    resetTurn: () => set({    //턴 리셋하는 함수
        rollcount: 3,
        keeps: [false, false, false, false, false],
        rollTrigger: 0,
    }),
    returnToGlass: () => set({ isReturningToGlass: true }),   //잔에 넣기위한 boolean 변경 함수
    resetAfterReturn: () => set({   //초기화 함수
        isReturningToGlass: false,
        rollTrigger: 0,
    })
}))