import { writable } from "svelte/store";

export const isDraggingCard = writable(false);

function calculateOffset(element: HTMLElement, event: MouseEvent) {
  const initialElementX = element.offsetLeft;
  const initialElementY = element.offsetTop;
  const initialMouseX = event.pageX;
  const initialMouseY = event.pageY;
  return {
    x: initialMouseX - initialElementX,
    y: initialMouseY - initialElementY,
  };
}

function getClone(element: HTMLElement) {
  const shouldCloneChildren = true;
  const clone = element.cloneNode(shouldCloneChildren);
  clone.style.position = "absolute";
  clone.style.width = `${element.clientWidth + 4}px`;
  clone.classList.add("shadow-lg");
  return clone;
}

function moveElementToMousePosition(
  element: HTMLElement,
  event: MouseEvent,
  offset: { x: number; y: number }
) {
  element.style.top = `${event.pageY - offset.y}px`;
  element.style.left = `${event.pageX - offset.x}px`;
}

export function drag(element: HTMLElement) {
  element.addEventListener("mousedown", (clickEvent) => {
    isDraggingCard.set(true);

    const offset = calculateOffset(element, clickEvent);
    const clone = getClone(element);
    document.body.appendChild(clone);
    moveElementToMousePosition(clone, clickEvent, offset);
    element.classList.add("invisible");

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveElementToMousePosition(clone, moveEvent, offset);
    };

    const handleMouseUp = () => {
      isDraggingCard.set(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      clone.remove();
      element.classList.remove("invisible");
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  });
}
