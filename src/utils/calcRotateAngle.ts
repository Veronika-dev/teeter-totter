import { MAX_BENDING } from '@/utils/constants';

export default (bending: number): number => {
  const minAngle = Math.min(Math.abs(bending / 2), MAX_BENDING);
  return minAngle * (bending > 0 ? 1 : -1);
};
