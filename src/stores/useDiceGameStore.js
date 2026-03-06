import { create } from "zustand";

export const GAME_STATE = {
    MENU: 'MENU',         // 시작 전
    READY: 'READY',       // 주사위가 컵에 들어감
    DRAGGING: 'DRAGGING', // 컵을 잡고 흔드는 중
    THROWN: 'THROWN',     // 던져짐
    ENDED: 'ENDED',       // 결과 확인 및 킵 가능 상태
    RETURNING: 'RETURNING'// 컵으로 다시 돌아가는 중
}

export const useDiceGameStore = create((set, get) => ({
    gameState: GAME_STATE.MENU,
    diceValues: Array(5).fill(null),
    keeps: [],
    rollCount: 3,

    // 1. 게임 시작
    startGame: () => set({
        gameState: GAME_STATE.READY,
        keeps: [],
        diceValues: Array(5).fill(null),
        rollCount: 3,
    }),

    // 2. 컵 드래그
    startDrag: () => set({ gameState: GAME_STATE.DRAGGING }),

    // 3. 컵 던지기
    throwCup: () => {
        const { rollCount, diceValues, keeps } = get();
        if (rollCount <= 0) return;
        
        set({
            gameState: GAME_STATE.THROWN,
            rollCount: rollCount - 1,
            // 🚩 킵(Keep)하지 않은 주사위만 null로 변경하여 다시 굴러감을 표시
            diceValues: diceValues.map((v, i) => 
                keeps.some(k => k.originalIndex === i) ? v : null
            )
        });
    },

    // 4. 주사위 결과 확인
    setDiceResult: (index, value) => {
        const { diceValues, gameState } = get();
        if (gameState !== GAME_STATE.THROWN) return; // 던져진 상태일 때만 기록

        const newValues = [...diceValues];
        newValues[index] = value;
        const isAllSettled = newValues.every(v => v !== null);

        set({
            diceValues: newValues,
            // 5개가 다 멈추면 자동으로 ENDED 상태로 전환
            gameState: isAllSettled ? GAME_STATE.ENDED : GAME_STATE.THROWN
        });
    },

    // 5. 주사위 고정 (Keep)
    toggleKeep: (originalIndex) => set((state) => {
        if (state.gameState !== GAME_STATE.ENDED) return state; // ENDED일 때만 가능
        
        const currentDiceValue = state.diceValues[originalIndex];
        const existingIndex = state.keeps.findIndex(k => k.originalIndex === originalIndex);
        if(existingIndex !== -1){
            return { keeps: state.keeps.filter(k => k.originalIndex !== originalIndex) };
        } else {
            if(state.keeps.length >= 5) return state;
            return { keeps: [...state.keeps, { originalIndex: originalIndex, value: currentDiceValue }] };
        }
    }),

    // 6. 주사위 모으기 (컵 클릭 시)
    gatherDice: () => {
        const { rollCount } = get();
        if (rollCount > 0) {
            set({ gameState: GAME_STATE.RETURNING }); // 돌아가는 애니메이션 시작
        }
    },

    // 7. 모으기 완료
    setReady: () => set({ gameState: GAME_STATE.READY })
})) 