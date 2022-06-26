import { writable } from "svelte/store";
import { columns } from "./board.ts";
import { changeCounter, moveCard } from "../comm/comm.ts";

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

function moveElementToMousePosition(
  element: HTMLElement,
  event: MouseEvent,
  offset: { x: number; y: number }
) {
  element.style.top = `${event.pageY - offset.y}px`;
  element.style.left = `${event.pageX - offset.x}px`;
}

function prepareElementForDragging(element: HTMLElement, width: number) {
  element.style.position = "absolute";
  element.style.width = `${width}px`;
  element.classList.add("shadow-lg");
}

function useDropZones() {
  const columnWidth = window.innerWidth / columns.length;
  const columnElements = document.getElementById("board").children;
  const dropZoneClass = "bg-neutral-300";

  let previousHoveredColumnIndex = null;

  const adjustDropZonesOnMove = (element: HTMLElement) => {
    const draggedCardCenterX = element.offsetLeft + element.clientWidth / 2;
    const hoveredColumnIndex = Math.floor(draggedCardCenterX / columnWidth);
    if (hoveredColumnIndex !== previousHoveredColumnIndex) {
      columnElements[previousHoveredColumnIndex]?.classList.remove(
        dropZoneClass
      );
      columnElements[hoveredColumnIndex].classList.add(dropZoneClass);
      previousHoveredColumnIndex = hoveredColumnIndex;
    }
  };

  const cleanupDropZones = () => {
    columnElements[previousHoveredColumnIndex].classList.remove(dropZoneClass);
    return previousHoveredColumnIndex;
  };

  return { adjustDropZonesOnMove, cleanupDropZones };
}

export function drag(element: HTMLElement) {
  element.addEventListener("mousedown", (clickEvent) => {
    isDraggingCard.set(true);

    const draggedClone = element.cloneNode(true);
    prepareElementForDragging(draggedClone, element.clientWidth);
    document.body.appendChild(draggedClone);

    element.classList.add("invisible");

    /*
    const placeholderClone = element.cloneNode(true);
    placeholderClone.classList.add("invisible");
    placeholderClone.style.position = "absolute";
    placeholderClone.style.top = "0";
    placeholderClone.style.left = "0";
    document.body.appendChild(placeholderClone);
    */

    const offset = calculateOffset(element, clickEvent);
    moveElementToMousePosition(draggedClone, clickEvent, offset);

    const { adjustDropZonesOnMove, cleanupDropZones } = useDropZones();
    adjustDropZonesOnMove(draggedClone);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveElementToMousePosition(draggedClone, moveEvent, offset);
      adjustDropZonesOnMove(draggedClone);
    };

    const handleMouseUp = () => {
      isDraggingCard.set(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      draggedClone.remove();
      // placeholderClone.remove();

      const finalDropZone = cleanupDropZones();
      moveCard(element.getAttribute("data-key"), finalDropZone);
      changeCounter.update((value) => value + 1);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  });
}
