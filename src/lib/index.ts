import { debounceFrame } from "./utils";

/**
 * @description SPA 컴포넌트 프레임워크 부분
 */
const SPA = () => {
  const _removeAllChildren = ($element: Node) => {
    while ($element.firstChild) {
      $element.removeChild($element.firstChild);
    }
  };

  const _replaceNode = ($oldNode: Node, $newNode: Node) => {
    $oldNode.parentNode?.replaceChild($newNode, $oldNode);
  };

  /**
   * @type {Node}
   */
  let $target: Node | null = null;
  let root: (() => Node) | null = null;
  /**
   * @description 루트 컴포넌트를 생성하는 함수
   */
  const createRoot = (_$target: Node, _root: () => Node) => {
    $target = _$target;
    _removeAllChildren($target);
    root = _root;
    _render();
  };
  /**
   * @description useState 함수
   * 클로져를 사용해서 state를 유지한다.
   * useState는 마운트 시에 호출하는 것을 권장한다.
   */
  const useState = <T>(initialState: T): [() => T, (newState: T) => void] => {
    let state = initialState;
    const getState = () => state;
    const setState = (newState: T) => {
      state = newState;
      _render();
    };
    return [getState, setState];
  };
  /**
   * @description diffing 알고리즘을 통해 가상돔과 실제돔을을 비교하여 업데이트하는 함수
   */
  const _updateDom = ($dom: Node | null, $virtualDom: Node | null) => {
    if ($dom == null) {
      return;
    }
    // 가상 돔이 null이면, 실제 돔을 제거
    if ($virtualDom == null) {
      $dom.parentNode?.removeChild($dom);
      return;
    }
    if ($dom instanceof Element) {
      if ($virtualDom instanceof Element) {
        // 둘 다 Element인 경우
        if ($dom.nodeName !== $virtualDom.nodeName) {
          _replaceNode($dom, $virtualDom);
        } else if (
          $dom.getAttribute("key") !== $virtualDom.getAttribute("key")
        ) {
          _replaceNode($dom, $virtualDom);
        }
        _updateAttributes($dom, $virtualDom);
      } else {
        // 가상 돔이 Element가 아닌 경우
        _replaceNode($dom, $virtualDom);
      }
    } else {
      if ($virtualDom instanceof Element) {
        // 실제 돔이 Element가 아닌 경우
        _replaceNode($dom, $virtualDom);
      } else if ($dom.textContent !== $virtualDom.textContent) {
        $dom.textContent = $virtualDom.textContent;
      }
    }

    _updateChildren($dom, $virtualDom);
  };

  /**
   * @description 가상 dom과 실제 dom의 속성을 비교해서 업데이트
   */
  const _updateAttributes = ($dom: Element, $virtualDom: Element) => {
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
   */
  const _updateChildren = ($dom: Node, $virtualDom: Node) => {
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
    const $virtualDom = root?.() ?? null;
    const $dom = $target?.firstChild ?? null;

    if ($dom == null && $virtualDom != null) {
      $target?.appendChild($virtualDom);
      return;
    }
    _updateDom($dom, $virtualDom);
  });

  return { createRoot, useState };
};

export const { createRoot, useState } = SPA();
