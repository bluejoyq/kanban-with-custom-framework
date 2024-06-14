import { debounce } from "../../src/lib/utils";
import { describe, test, expect } from "@jest/globals";

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};
describe("debounce", () => {
  test("debounce가 걸린 함수는 여러번 호출하더라도 delay 이후에 한번만 실행된다.", () => {
    let count = 0;
    const mockCallback = () => {
      count += 1;
    };
    const debouncedCallback = debounce(mockCallback, 100);
    debouncedCallback();
    debouncedCallback();
    setTimeout(() => {
      expect(count).toBe(1);
    }, 200); // 100ms 지연보다 더 긴 시간을 기다립니다.
  });
  test("debounce를 걸고 delay를 기다리며 여러번 호출하면 정상적으로 실행된다.", async () => {
    let count = 0;
    const mockCallback = () => {
      count += 1;
    };
    const debouncedCallback = debounce(mockCallback, 100);
    debouncedCallback();
    await wait(150);
    debouncedCallback();
    await wait(150);
    expect(count).toBe(2);
  });
});
