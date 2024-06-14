import { describe, test, expect } from "@jest/globals";
import { createRoot, useState } from "../../src/lib/index";
import { Button, Div } from "../../src/lib/Element";

describe("createRoot", () => {
  test("createRoot를 정의하면 요소가 삽입된다.", () => {
    document.body.innerHTML = "<div id='root'></div>";
    createRoot(document.getElementById("root"), () => {
      return Div({
        children: ["Hello World"],
        ["data-testid"]: "div",
      });
    });

    setTimeout(() => {
      const $elem = document.querySelector(`[data-testid="div"]`);
      expect($elem.textContent).toBe("Hello World");
    }, 0);
  });
  test("createRoot를 정의하면 요소가 삽입된다.", () => {
    document.body.innerHTML = "<div id='root'></div>";
    createRoot(document.getElementById("root"), () => {
      return Div({
        children: ["Hello World"],
        ["data-testid"]: "div",
      });
    });

    setTimeout(() => {
      const $elem = document.querySelector(`[data-testid="div"]`);
      expect($elem.parentElement.id).toBe("root");
    }, 0);
  });
});

describe("useState", () => {
  const TestElem = () => {
    const [state, setState] = useState(0);
    const $TestElem2 = TestElem2();
    return () => {
      Div({
        children: [
          Button({
            onclick: () => {
              setState(state + 1);
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
      Div({
        children: [
          Button({
            onclick: () => {
              setState(state + 1);
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

  test("state의 초기 값이 잘 설정된다.", () => {
    document.body.innerHTML = "<div id='root'></div>";
    createRoot(document.getElementById("root"), TestElem());

    setTimeout(() => {
      const $elem = document.querySelector(`[data-testid="target"]`);
      expect($elem.textContent).toBe("0");
    }, 0);
  });
  test("state의 값이 잘 변경된다.", () => {
    document.body.innerHTML = "<div id='root'></div>";
    createRoot(document.getElementById("root"), TestElem());

    setTimeout(() => {
      const $elem = document.querySelector(`[data-testid="target"]`);
      const $button = document.querySelector(`[data-testid="button"]`);
      $button.click();
      expect($elem.textContent).toBe("1");
    }, 0);
  });

  test("부모의 state가 바뀌더라도 자식의 state는 바뀌지 않는다.", () => {
    document.body.innerHTML = "<div id='root'></div>";
    createRoot(document.getElementById("root"), TestElem());

    setTimeout(() => {
      const $elem = document.querySelector(`[data-testid="child-target"]`);
      const $button = document.querySelector(`[data-testid="button"]`);
      const $button2 = document.querySelector(`[data-testid="button2"]`);
      $button2.click();
      $button.click();
      expect($elem.textContent).toBe("1");
    }, 0);
  });
});
