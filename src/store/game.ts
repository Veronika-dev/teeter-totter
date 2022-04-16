import {
  GameStatus, IGameElement, State, TGameStatus,
} from '@/types/game';
import { MAX_BENDING, TT_WIDTH, TIMER_INITIAL } from '@/utils/constants';
import createRandomElement from '@/utils/createRandomElement';
import { Commit, Dispatch } from 'vuex';

const SET_FALLING_ELEMENT = 'SET_FALLING_ELEMENT';
const REMOVE_FALLING_ELEMENT = 'REMOVE_FALLING_ELEMENT';
const CHANGE_FALLING_ELEMENT = 'CHANGE_FALLING_ELEMENT';
const PUSH_WEIGHT = 'PUSH_WEIGHT';
const CHANGE_STATUS_GAME = 'CHANGE_STATUS_GAME';
const CLEAR_GAME_DATA = 'CLEAR_GAME_DATA';
const CHANGE_TIMER_VALUE = 'CHANGE_TIMER_VALUE';
const SET_PUSH_AFTER_CONTINUE = 'SET_PUSH_AFTER_CONTINUE';

const getTotalWeight = (array: IGameElement[]) => array.reduce((acc: number, item: IGameElement) => acc + item.weight, 0);
const getTorque = (array: IGameElement[]) => array.reduce((acc: number, item: IGameElement) => acc + item.weight * item.offset, 0);

let timeout: number | null = null;

export default {
  namespaced: true,
  state: () => ({
    gameStatus: GameStatus.NOT_STARTED,
    weights: [createRandomElement('right')],
    bending: 0,
    fallingWeight: null,
    timer: TIMER_INITIAL,
    pushAfterContinue: false,
  }),
  getters: {
    gameStatus(state: State): TGameStatus {
      return state.gameStatus;
    },
    timer(state: State): number {
      return state.timer;
    },
    weights(state: State): IGameElement[] {
      return state.weights;
    },
    fallingWeight(state: State): IGameElement | null {
      return state.fallingWeight;
    },
    leftWeights(state: State): IGameElement[] {
      return state.weights.filter((item: IGameElement) => item.side === 'left');
    },
    rightWeights(state: State): IGameElement[] {
      return state.weights.filter((item: IGameElement) => item.side === 'right');
    },
    totalLeftWeight(state: State, getters: { leftWeights: IGameElement[] }): number {
      return getTotalWeight(getters.leftWeights);
    },
    totalRightWeight(state: State, getters: { rightWeights: IGameElement[] }): number {
      return getTotalWeight(getters.rightWeights);
    },
    leftTorque(state: State, getters: { leftWeights: IGameElement[] }): number {
      return getTorque(getters.leftWeights);
    },
    rightTorque(state: State, getters: { rightWeights: IGameElement[] }): number {
      return getTorque(getters.rightWeights);
    },
    bending(state: State, getters: { totalLeftWeight: number, leftTorque: number, rightTorque: number }): number {
      if (!getters.totalLeftWeight) {
        return 0;
      }
      const isToLeft = getters.leftTorque > getters.rightTorque;
      const firstEl = isToLeft ? getters.leftTorque : getters.rightTorque;
      const secondEl = isToLeft ? getters.rightTorque : getters.leftTorque;
      return Math.floor(((firstEl - secondEl) / firstEl) * (isToLeft ? -100 : 100));
    },
  },
  mutations: {
    [CHANGE_STATUS_GAME](state: State, payload: TGameStatus) {
      state.gameStatus = payload;
    },
    [SET_FALLING_ELEMENT](state: State, payload: IGameElement | null) {
      state.fallingWeight = payload;
    },
    [REMOVE_FALLING_ELEMENT](state: State) {
      state.fallingWeight = null;
    },
    [CHANGE_FALLING_ELEMENT](state: State, payload: IGameElement) {
      state.fallingWeight = { ...state.fallingWeight, ...payload };
    },
    [PUSH_WEIGHT](state: State, payload: IGameElement) {
      state.weights.push(payload);
    },
    [CLEAR_GAME_DATA](state: State) {
      state.pushAfterContinue = false;
      state.timer = TIMER_INITIAL;
      state.fallingWeight = null;
      state.weights = [createRandomElement('right')];
    },
    [CHANGE_TIMER_VALUE](state: State, value : number) {
      state.timer = value;
    },
    [SET_PUSH_AFTER_CONTINUE](state: State, value = true) {
      state.pushAfterContinue = value;
    },
  },
  actions: {
    pushFallingElement({ commit, getters }: { commit: Commit, getters: { leftTorque: number, rightTorque: number }}) {
      commit(SET_FALLING_ELEMENT, createRandomElement('left', { leftT: getters.leftTorque, rightT: getters.rightTorque }));
    },
    async moveFallingElementToRightArray({ state, commit, dispatch }: { commit: Commit, state: State, dispatch: Dispatch }) {
      const isLose = await dispatch('pushAndCheckIfExtraWeight', state.fallingWeight);
      commit(REMOVE_FALLING_ELEMENT);
      if (!isLose) {
        dispatch('nextGameStep');
      }
    },
    pushAndCheckIfExtraWeight(
      { dispatch, getters, commit }: { dispatch: Dispatch, commit: Commit, getters: { leftWeights: IGameElement[], rightWeights: IGameElement[] } },
      weigth: IGameElement,
    ) {
      commit(PUSH_WEIGHT, weigth);
      const leftWeights10and2 = getters.leftWeights.filter((item) => item.weight === 10 && item.offset === 2);
      if (leftWeights10and2.length > 1) {
        dispatch('loseGame');
        return true;
      }
      const rightWeights10and2 = getters.rightWeights.filter((item) => item.weight === 10 && item.offset === 2);
      if (rightWeights10and2.length > 1) {
        dispatch('loseGame');
        return true;
      }
      return false;
    },
    async nextGameStep({
      state, dispatch, getters, commit,
    } : {
      state: State, dispatch: Dispatch, getters: { bending: number }, commit: Commit,
    }) {
      if (state.gameStatus !== GameStatus.PLAYING && state.gameStatus !== GameStatus.DEMO) return;
      if (Math.abs(getters.bending) >= MAX_BENDING) {
        dispatch('loseGame');
      } else {
        timeout = null;
        timeout = setTimeout(async () => {
          if (state.gameStatus !== GameStatus.PLAYING && state.gameStatus !== GameStatus.DEMO) {
            commit(SET_PUSH_AFTER_CONTINUE, true);
            return;
          }
          const isLose = await dispatch('pushAndCheckIfExtraWeight', createRandomElement('right'));
          if (!isLose) dispatch('pushFallingElement');
        }, 1000); // wait for animation
      }
    },
    moveFallingElement({ state, commit }: { commit: Commit, state: State }, direction: 'left' | 'right') {
      const fallingElement = state.fallingWeight;
      if (!fallingElement || (state.gameStatus !== GameStatus.PLAYING && state.gameStatus !== GameStatus.DEMO)) return;
      const incDec = direction === 'left' ? 1 : -1;
      const newOffset = fallingElement.offset + incDec;
      if (newOffset > 0 && newOffset <= TT_WIDTH / 2) {
        commit(CHANGE_FALLING_ELEMENT, { offset: newOffset });
      }
    },
    startGame({ commit, dispatch, state }: { commit: Commit, dispatch: Dispatch, state: State }) {
      if (timeout) clearTimeout(timeout);
      if (state.gameStatus === GameStatus.FAILED || state.gameStatus === GameStatus.DEMO) {
        commit(CLEAR_GAME_DATA);
      }
      commit(CHANGE_STATUS_GAME, GameStatus.PLAYING);
      dispatch('pushFallingElement');
    },
    async continueGame({ commit, dispatch, state }: { commit: Commit, dispatch: Dispatch, state: State }) {
      commit(CHANGE_STATUS_GAME, GameStatus.PLAYING);
      if (state.pushAfterContinue) {
        const isLose = await dispatch('pushAndCheckIfExtraWeight', createRandomElement('right'));
        if (!isLose) dispatch('pushFallingElement');
        commit(SET_PUSH_AFTER_CONTINUE, false);
      }
    },
    restartGame({ commit, dispatch }: { commit: Commit, dispatch: Dispatch }) {
      commit(CLEAR_GAME_DATA);
      dispatch('startGame');
    },
    pauseGame({ commit, state }: { commit: Commit, state: State }) {
      if (state.gameStatus === GameStatus.PLAYING) {
        commit(CHANGE_STATUS_GAME, GameStatus.PAUSED);
      }
    },
    loseGame({ commit }: { commit: Commit }) {
      commit(CHANGE_STATUS_GAME, GameStatus.FAILED);
    },
    winGame({ commit }: { commit: Commit }) {
      commit(CHANGE_STATUS_GAME, GameStatus.WIN);
      commit(REMOVE_FALLING_ELEMENT);
    },
    startDemo({ commit, dispatch }: { commit: Commit, dispatch: Dispatch }) {
      commit(CLEAR_GAME_DATA);
      commit(CHANGE_STATUS_GAME, GameStatus.DEMO);
      dispatch('pushFallingElement');
    },
    decreaseTimer({ commit, state, dispatch }: { state: State, commit: Commit, dispatch: Dispatch }) {
      const newValue = state.timer - 1;
      commit(CHANGE_TIMER_VALUE, newValue);
      if (newValue === 0) {
        dispatch('winGame');
      }
    },
  },
};
