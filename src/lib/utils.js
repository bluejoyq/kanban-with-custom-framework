/**
 * @param {Function} callback
 * @param {number?} delay ms
 * @return {function(...any):void}
 * @description 디바운스 함수, delay 이후에 callback 함수를 실행한다.
 */
export const debounce = (callback, delay = 100) => {
  let timeoutId = null;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

/**
 *
 * @param {function(...any):void} callback
 * @return {function(...any):void}
 * @description requestAnimationFrame을 이용한 디바운스 함수
 */
export const debounceFrame = (callback) => {
  let timeoutId = null;
  return (...args) => {
    if (timeoutId) cancelAnimationFrame(timeoutId);
    timeoutId = requestAnimationFrame(() => {
      callback(...args);
    });
  };
};
