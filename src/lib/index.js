import { debounceFrame } from "./utils";

/**
 * @description SPA 컴포넌트 프레임워크 부분
 * @return {{createRoot: function(HTMLElement, function():HTMLElement), useState: function(*):[function():any, function(any):void]}}
 */
const SPA = () => {
  /**
   * @type {HTMLElement}
   */
  let $target = null;
  let root = null;
  /**
   * @param {HTMLElement} _$target
   * @param {function():HTMLElement} _root
   */
  const createRoot = (_$target, _root) => {
    $target = _$target;
    $target.innerHTML = "";
    root = _root;
    _render();
  };
  /**
   * @param {*} initialState
   * @return {[function():any, function(any):void]}
   * @description useState 함수
   * 클로져를 사용해서 state를 유지한다.
   * useState는 마운트 시에 호출하는 것을 권장한다.
   */
  const useState = (initialState) => {
    let state = initialState;
    const getState = () => state;
    const setState = (newState) => {
      state = newState;
      _render();
    };
    return [getState, setState];
  };
  /**
   * dom을 업데이트하는 함수
   * @param {HTMLElement} $dom 실제 돔
   * @param {HTMLElement} $virtualDom 가상 돔
   */
  const _updateDom = ($dom, $virtualDom) => {
    if ($dom == null) {
      return;
    }
    // 가상 돔이 null이면, 실제 돔을 제거
    if ($virtualDom == null) {
      $dom.remove();
      return;
    }
    if (
      $dom.nodeType !== $virtualDom.nodeType ||
      ($dom.nodeType !== Node.TEXT_NODE &&
        $dom.getAttribute("key") !== $virtualDom.getAttribute("key"))
    ) {
      // 두 노드가 다르면, 새로운 노드로 교체
      $dom.replaceWith($virtualDom);
      return;
    }
    if (
      $dom.nodeType === Node.TEXT_NODE &&
      $dom.textContent !== $virtualDom.textContent
    ) {
      $dom.textContent = $virtualDom.textContent;
      return;
    }
    if ($dom.nodeName !== $virtualDom.nodeName) {
      $dom.replaceWith($virtualDom);
      return;
    }
    // 속성만을 업데이트 하고 자식 노드들에게도 반복
    _updateAttributes($dom, $virtualDom);
    _updateChildren($dom, $virtualDom);
  };

  /**
   * @description 가상 dom과 실제 dom의 속성을 비교해서 업데이트
   * @param {HTMLElement} $dom 실제 돔
   * @param {HTMLElement} $virtualDom 가상 돔
   */
  const _updateAttributes = ($dom, $virtualDom) => {
    const domAttrs = $dom.attributes;
    const virtualAttrs = $virtualDom.attributes;
    Array.from(domAttrs ?? []).forEach((attr) => {
      const name = attr.name;
      if (virtualAttrs.getNamedItem(name)) {
        return;
      }
      $dom.removeAttribute(name);
    });
    Array.from(virtualAttrs ?? []).forEach((attr) => {
      if (domAttrs.getNamedItem(attr.name)) {
        return;
      }
      $dom.setAttribute(attr.name, attr.value);
    });
  };

  /**
   * @description 자식 노드들을 재귀적으로 업데이트함.
   * @param {HTMLElement} $dom 실제 돔
   * @param {HTMLElement} $virtualDom 가상 돔.
   */
  const _updateChildren = ($dom, $virtualDom) => {
    const domChildren = Array.from($dom.childNodes);
    const virtualChildren = Array.from($virtualDom.childNodes);
    const max = Math.max(domChildren.length, virtualChildren.length);

    for (let i = 0; i < max; i++) {
      if (i >= virtualChildren.length) {
        $dom.removeChild(domChildren[i]);
        continue;
      }
      if (i >= domChildren.length) {
        $dom.appendChild(virtualChildren[i]);
        continue;
      }
      _updateDom(domChildren[i], virtualChildren[i]);
    }
  };
  const _render = debounceFrame(() => {
    const $virtualDom = root();
    const $dom = $target.firstChild;
    if ($dom == null) {
      $target.appendChild($virtualDom);
      return;
    }
    _updateDom($dom, $virtualDom);
  });

  return { createRoot, useState };
};

export const { createRoot, useState } = SPA();
