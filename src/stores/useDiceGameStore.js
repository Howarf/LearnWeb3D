import { create } from "zustand";

export const GAME_STATE = {
    MENU: 'MENU',         // 시작 전
    READY: 'READY',       // 주사위가 컵에 들어감
    DRAGGING: 'DRAGGING', // 컵을 잡고 흔드는 중
    THROWN: 'THROWN',     // 던져짐
    ENDED: 'ENDED',       // 결과 확인 및 킵 가능 상태
    RETURNING: 'RETURNING',// 컵으로 다시 돌아가는 중
    GAME_OVER: 'GAME_OVER',// 게임 종료 상태
}

const getInitialScores = () => ({
    aces: null, deuces: null, threes: null, fours: null, fives: null, sixes: null,
    choice: null, fourOfAKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yacht: null
});

export const useDiceGameStore = create((set, get) => ({
    gameState: GAME_STATE.MENU,
    diceValues: Array(5).fill(null),
    player: 2,
    currentPlayer: 0,
    turn: 1,
    keeps: [],
    rollCount: 3,
    scores: [getInitialScores(), getInitialScores() ],

    // 0. 플레이어수 컨트롤
    addPlayer: () => set((state) => ({ player: Math.min(4, state.player + 1) })),
    subtractPlayer: () => set((state) => ({ player: Math.max(2, state.player - 1) })),

    // 1. 게임 시작
    startGame: () => {
        const {player} = get()
        set({
            gameState: GAME_STATE.READY,
            keeps: [],
            diceValues: Array(5).fill(null),
            rollCount: 3,
            currentPlayer: 0,
            turn: 1,
            scores: Array(player).fill(null).map(() => getInitialScores())
        })
    },

    // 2. 컵 드래그
    startDrag: () => set({ gameState: GAME_STATE.DRAGGING }),

    // 3. 컵 던지기
    throwCup: () => {
        const { rollCount, diceValues, keeps } = get()
        if (rollCount <= 0) return
        
        set({
            gameState: GAME_STATE.THROWN,
            rollCount: rollCount - 1,
            // 킵(Keep)하지 않은 주사위만 null로 변경하여 다시 굴러감을 표시
            diceValues: diceValues.map((v, i) => 
                keeps.some(k => k.originalIndex === i) ? v : null
            )
        });
    },

    // 4. 주사위 결과 확인
    setDiceResult: (index, value) => {
        const { diceValues, gameState } = get()
        if (gameState !== GAME_STATE.THROWN) return // 던져진 상태일 때만 기록

        const newValues = [...diceValues]
        newValues[index] = value
        const isAllSettled = newValues.every(v => v !== null)

        set({
            diceValues: newValues,
            // 5개가 다 멈추면 자동으로 ENDED 상태로 전환
            gameState: isAllSettled ? GAME_STATE.ENDED : GAME_STATE.THROWN
        })
    },

    // 5. 주사위 고정 (Keep)
    toggleKeep: (originalIndex) => set((state) => {
        if (state.gameState !== GAME_STATE.ENDED) return state // ENDED일 때만 가능
        
        const currentDiceValue = state.diceValues[originalIndex]
        const existingIndex = state.keeps.findIndex(k => k.originalIndex === originalIndex)
        if(existingIndex !== -1){
            return { keeps: state.keeps.filter(k => k.originalIndex !== originalIndex) }
        } else {
            if(state.keeps.length >= 5) return state
            return { keeps: [...state.keeps, { originalIndex: originalIndex, value: currentDiceValue }] }
        }
    }),

    // 6. 주사위 모으기 (컵 클릭 시)
    gatherDice: () => {
        const { rollCount } = get()
        if (rollCount > 0) {
            set({ gameState: GAME_STATE.RETURNING }) // 돌아가는 애니메이션 시작
            setTimeout(() => {set({gameState: GAME_STATE.READY})}, 650)
        }
    },

    // 7. 점수판에 점수 기록하기
    recordScore: (category, score) =>{
        const { scores, currentPlayer, player, turn } = get()
        if(scores[currentPlayer][category] !== null) return

        const newScores = [...scores]
        newScores[currentPlayer] = { ...newScores[currentPlayer], [category]: score }
        let nextPlayer = currentPlayer + 1
        let nextTurn = turn
        let nextState = GAME_STATE.RETURNING
        if (nextPlayer >= player) {
            nextPlayer = 0
            nextTurn++
            if (nextTurn > 12) {
                nextState = GAME_STATE.GAME_OVER
            }
        }
        set({
            scores: newScores,
            currentPlayer: nextPlayer,
            turn: nextTurn,
            gameState: nextState,
            keeps: [],
            diceValues: Array(5).fill(null),
            rollCount: 3,
        })

        if(nextState !== GAME_STATE.GAME_OVER){
            setTimeout(() => {
                set({gameState: GAME_STATE.READY})
            }, 900)
        }
    },

    // 8. 다시 시작하기 함수
    resetToMenu: () => set({ 
        gameState: GAME_STATE.MENU,
        keeps: [],
        diceValues: Array(5).fill(null),
        rollCount: 3
    }),

})) 