export interface Series { id: string; dimensions: number; observed: number[]; best_so_far: number[]; }
export const score = (value: number): string => {
  if (value !== 0 && (Math.abs(value) < .001 || Math.abs(value) >= 1e6)) return value.toExponential(2);
  return value.toFixed(2);
};
export const pointX = (index: number, width = 800) => 104 + index / 12 * (width - 130);
export function chart(series: Series, round: number, width = 800) {
  const height = width < 540 ? 300 : 330;
  const count = Math.max(1, Math.min(series.observed.length, Math.floor(round) || 1));
  const min = Math.min(...series.observed), max = Math.max(...series.observed);
  const range = max - min || Math.abs(max) || 1;
  const low = min - range * .1, high = max + range * .1;
  const y = (value: number) => height - 46 - (value - low) / (high - low) * (height - 70);
  const dots = series.observed.slice(0,count).map((value,index) => ({x:pointX(index,width),y:y(value),value,round:index+1}));
  const points = dots.map(p => `${p.x},${p.y}`).join(' ');
  let steps = '';
  series.best_so_far.slice(0,count).forEach((value,i) => {
    steps += i === 0 ? `M${pointX(i,width)},${y(value)}` : `H${pointX(i,width)}V${y(value)}`;
  });
  const ticks = [0,.25,.5,.75,1].map(fraction => ({ y:y(low+(high-low)*fraction), label:score(low+(high-low)*fraction) }));
  const xTicks = (width < 540 ? [1,7,13] : [1,4,7,10,13]).map(round => ({x:pointX(round-1,width),label:`W${String(round).padStart(2,'0')}`}));
  return {count,dots,points,steps,ticks,xTicks,width,height};
}
