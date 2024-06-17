import { describe, test, expect } from "@jest/globals";
import { createRoot, useState } from "../../src/lib/index";
import { Button, Div } from "../../src/lib/Element";

const sleep = (ms: number = 150) =>
  new Promise((resolve) => setTimeout(resolve, ms));
describe("createRoot", () => {
  test("createRoot를 정의하면 요소가 삽입된다.", async () => {
    document.body.innerHTML = "<div id='root'></div>";
    createRoot(document.getElementById("root")!, () => {
      return Div({
        children: ["Hello World"],
        ["data-testid"]: "div",
      });
    });

    await sleep();
    const $elem = document.querySelector(`[data-testid="div"]`);
    expect($elem?.textContent).toBe("Hello World");
  });
  test("createRoot를 정의하면 요소가 삽입된다.", async () => {
    document.body.innerHTML = "<div id='root'></div>";
    createRoot(document.getElementById("root")!, () => {
      return Div({
        children: ["Hello World"],
        ["data-testid"]: "div",
      });
    });
    await sleep();
    const $elem = document.querySelector(`[data-testid="div"]`);
    expect($elem?.parentElement?.id).toBe("root");
  });
});

describe("useState", () => {
  const TestElem = () => {
    const [state, setState] = useState(0);
    const $TestElem2 = TestElem2();
    return () => {
      return Div({
        children: [
          Button({
            onClick: () => {
              setState(state() + 1);
            },
            children: ["Click"],
            ["data-testid"]: "button",
          }),
          Div({
            children: [state()],
            ["data-testid"]: "target",
          }),
          $TestElem2(),
        ],
      });
    };
  };

  const TestElem2 = () => {
    const [state, setState] = useState(0);
    return () => {
      return Div({
        children: [
          Button({
            onClick: () => {
              setState(state() + 1);
            },
            children: ["Click"],
            ["data-testid"]: "button2",
          }),
          Div({
            children: [state()],
            ["data-testid"]: "child-target",
          }),
        ],
      });
    };
  };

  test("state의 초기 값이 잘 설정된다.", async () => {
    document.body.innerHTML = "<div id='root'></div>";
    createRoot(document.getElementById("root")!, TestElem());
    await sleep();
    const $elem = document.querySelector(`[data-testid="target"]`);
    expect($elem?.textContent).toBe("0");
  });
  test("state의 값이 잘 변경된다.", async () => {
    document.body.innerHTML = "<div id='root'></div>";
    createRoot(document.getElementById("root")!, TestElem());
    await sleep();
    const $elem = document.querySelector(`[data-testid="target"]`);
    const $button = document.querySelector(
      `[data-testid="button"]`,
    ) as HTMLButtonElement;
    $button?.click();
    await sleep();
    expect($elem?.textContent).toBe("1");
  });

  test("부모의 state가 바뀌더라도 자식의 state는 바뀌지 않는다.", async () => {
    document.body.innerHTML = "<div id='root'></div>";
    createRoot(document.getElementById("root")!, TestElem());

    await sleep();
    const $elem = document.querySelector(`[data-testid="child-target"]`);
    const $button = document.querySelector(
      `[data-testid="button"]`,
    ) as HTMLButtonElement;
    const $button2 = document.querySelector(
      `[data-testid="button2"]`,
    ) as HTMLButtonElement;
    $button2.click();
    $button.click();
    await sleep();
    expect($elem?.textContent).toBe("1");
  });
});
