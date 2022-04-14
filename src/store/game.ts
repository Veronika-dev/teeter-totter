import {
  GameStatus, IGameElement, State, TGameStatus,
} from '@/types/game';
import { MAX_BENDING, TT_WIDTH } from '@/utils/constants';
import createRandomElement from '@/utils/createRandomElement';
import { Commit, Dispatch } from 'vuex';

const SET_FALLING_ELEMENT = 'SET_FALLING_ELEMENT';
const REMOVE_FALLING_ELEMENT = 'REMOVE_FALLING_ELEMENT';
const CHANGE_FALLING_ELEMENT = 'CHANGE_FALLING_ELEMENT';
const PUSH_WEIGHT = 'PUSH_WEIGHT';
const CHANGE_STATUS_GAME = 'CHANGE_STATUS_GAME';
const CLEAR_GAME_DATA = 'CLEAR_GAME_DATA';

const getTotalWeight = (array: IGameElement[]) => array.reduce((acc: number, item: IGameElement) => acc + item.weight, 0);
const getTorque = (array: IGameElement[]) => array.reduce((acc: number, item: IGameElement) => acc + item.weight * item.offset, 0);

export default {
  namespaced: true,
  state: () => ({
    gameStatus: GameStatus.NOT_STARTED,
    weights: [createRandomElement('right')],
    bending: 0,
    fallingWeight: null,
  }),
  getters: {
    gameStatus(state: State): TGameStatus {
      return state.gameStatus;
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
        return MAX_BENDING;
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
      state.fallingWeight = null;
      state.weights = [createRandomElement('right')];
    },
  },
  actions: {
    pushFallingElement({ commit }: { commit: Commit }) {
      commit(SET_FALLING_ELEMENT, createRandomElement());
    },
    async moveFallingElementToRightArray({ state, commit, dispatch }: { commit: Commit, state: State, dispatch: Dispatch }) {
      const isLose = await dispatch('pushAndCheckIfExtraWeight', state.fallingWeight);
      commit(REMOVE_FALLING_ELEMENT);
      if (!isLose) {
        setTimeout(() => {
          dispatch('nextGameStep');
        }, 1000); // wait for animation
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
      state, dispatch, getters,
    } : {
      state: State, dispatch: Dispatch, getters: { bending: number },
    }) {
      if (state.gameStatus !== GameStatus.PLAYING && state.gameStatus !== GameStatus.DEMO) return;
      if (Math.abs(getters.bending) >= MAX_BENDING) {
        dispatch('loseGame');
      } else {
        const isLose = await dispatch('pushAndCheckIfExtraWeight', createRandomElement('right'));
        if (!isLose) dispatch('pushFallingElement');
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
      if (state.gameStatus === GameStatus.FAILED || state.gameStatus === GameStatus.DEMO) {
        commit(CLEAR_GAME_DATA);
      }
      commit(CHANGE_STATUS_GAME, GameStatus.PLAYING);
      dispatch('pushFallingElement');
    },
    continueGame({ commit }: { commit: Commit }) {
      commit(CHANGE_STATUS_GAME, GameStatus.PLAYING);
    },
    restartGame({ commit, dispatch }: { commit: Commit, dispatch: Dispatch }) {
      commit(CLEAR_GAME_DATA);
      dispatch('startGame');
    },
    pauseGame({ commit }: { commit: Commit }) {
      commit(CHANGE_STATUS_GAME, GameStatus.PAUSED);
    },
    loseGame({ commit }: { commit: Commit }) {
      commit(CHANGE_STATUS_GAME, GameStatus.FAILED);
    },
    startDemo({ commit, dispatch }: { commit: Commit, dispatch: Dispatch }) {
      commit(CLEAR_GAME_DATA);
      commit(CHANGE_STATUS_GAME, GameStatus.DEMO);
      dispatch('pushFallingElement');
    },
  },
};
