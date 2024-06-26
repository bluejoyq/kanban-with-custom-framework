/**
 * @description 디바운스 함수, delay 이후에 callback 함수를 실행한다.
 */
export const debounce = (callback: (...args: any[]) => void, delay = 100) => {
  let timeoutId: number | null = null;
  return (...args: any[]) => {
    if (timeoutId) window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

/**
 *
 * @description requestAnimationFrame을 이용한 디바운스 함수
 */
export const debounceFrame = (callback: (...args: any[]) => void) => {
  let timeoutId: number | null = null;
  return (...args: any[]) => {
    if (timeoutId) cancelAnimationFrame(timeoutId);
    timeoutId = requestAnimationFrame(() => {
      callback(...args);
    });
  };
};
