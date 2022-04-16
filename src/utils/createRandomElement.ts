import { TT_WIDTH } from '@/utils/constants';
import {
  IGameElement, TElementType, ElementType, BgColor, TBgColor, TSide,
} from '@/types/game';

const getType = (): TElementType => ElementType[Math.floor(Math.random() * (Object.keys(ElementType).length / 2))] as TElementType;
const bgColor = (): TBgColor => BgColor[Math.floor(Math.random() * (Object.keys(BgColor).length / 2))] as TBgColor;
const getWeight = (): number => {
  const max = 10;
  const min = 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getWeightDependOnGameData = ({ leftT, rightT } : { leftT: number, rightT: number }): number => {
  const maxLeftTorque = rightT + 0.3 * rightT - leftT;
  const minLeftTorque = rightT - 0.3 * rightT - leftT;
  const offsets = [1, 2, 3, 4, 5];
  const weightMax = 10;
  const weightMin = 1;
  const possibleWeights = new Set<number>();
  offsets.forEach((distance) => {
    const topWeight = Math.ceil(maxLeftTorque / distance);
    if (topWeight <= weightMax && topWeight >= weightMin) possibleWeights.add(topWeight);
    const bottomWeight = Math.ceil(minLeftTorque / distance);
    if (bottomWeight <= weightMax && bottomWeight >= weightMin) possibleWeights.add(bottomWeight);
  });
  const weightsArr: number[] = [...possibleWeights];
  if (weightsArr.length) {
    const min = Math.min(...weightsArr);
    const max = Math.max(...weightsArr);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return getWeight();
};

export default (side: TSide, torque?: { leftT: number, rightT: number }): IGameElement => {
  const weight = side === 'left' && torque ? getWeightDependOnGameData(torque) : getWeight();
  return {
    id: Symbol('idElement'),
    type: getType(),
    weight,
    offset: Math.floor((Math.random() * TT_WIDTH) / 2) + 1,
    color: bgColor(),
    side,
  };
};
