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

export default (side: TSide = 'left'): IGameElement => ({
  id: Symbol('idElement'),
  type: getType(),
  weight: getWeight(),
  offset: Math.floor((Math.random() * TT_WIDTH) / 2) + 1,
  color: bgColor(),
  side,
});
