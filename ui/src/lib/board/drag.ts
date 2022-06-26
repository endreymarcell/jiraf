import { writable } from "svelte/store";

export const isDraggingCard = writable(false);

export function drag(element: HTMLElement) {
  let offsetX = 0;
  let offsetY = 0;

  element.addEventListener("mousedown", (event) => {
    isDraggingCard.set(true);

    const initialElementWidth = element.clientWidth;
    const initialElementX = element.offsetLeft;
    const initialElementY = element.offsetTop;
    const initialMouseX = event.pageX;
    const initialMouseY = event.pageY;
    offsetX = initialMouseX - initialElementX;
    offsetY = initialMouseY - initialElementY;

    const shouldCloneChildren = true;
    const clone = element.cloneNode(shouldCloneChildren);

    clone.style.position = "absolute";
    clone.style.width = `${initialElementWidth + 4}px`;
    clone.style.top = `${event.pageY - offsetY}px`;
    clone.style.left = `${event.pageX - offsetX}px`;
    clone.classList.add("shadow-lg");

    document.body.appendChild(clone);
    element.classList.add("invisible");

    const handleMouseMove = (event: MouseEvent) => {
      clone.style.top = `${event.pageY - offsetY}px`;
      clone.style.left = `${event.pageX - offsetX}px`;
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
