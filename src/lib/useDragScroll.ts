"use client";
/**
 * useDragScroll - React hook to enable drag-to-scroll (mouse and touch) on a scrollable container.
 * Usage: const ref = useDragScroll(); <div ref={ref}>...</div>
 */
import { useRef, useEffect } from "react";

export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - el.offsetLeft;
      startY.current = e.pageY - el.offsetTop;
      scrollLeft.current = el.scrollLeft;
      scrollTop.current = el.scrollTop;
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const y = e.pageY - el.offsetTop;
      el.scrollLeft = scrollLeft.current - (x - startX.current);
      el.scrollTop = scrollTop.current - (y - startY.current);
    };
    const onMouseUp = () => {
      isDragging.current = false;
      el.style.cursor = "grab";
      el.style.removeProperty("user-select");
    };
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.style.cursor = "grab";

    // Touch events for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchScrollLeft = 0;
    let touchScrollTop = 0;
    const onTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      touchStartX = e.touches[0].pageX - el.offsetLeft;
      touchStartY = e.touches[0].pageY - el.offsetTop;
      touchScrollLeft = el.scrollLeft;
      touchScrollTop = el.scrollTop;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const x = e.touches[0].pageX - el.offsetLeft;
      const y = e.touches[0].pageY - el.offsetTop;
      el.scrollLeft = touchScrollLeft - (x - touchStartX);
      el.scrollTop = touchScrollTop - (y - touchStartY);
    };
    const onTouchEnd = () => {
      isDragging.current = false;
    };
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove);
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.style.removeProperty("cursor");
      el.style.removeProperty("user-select");
    };
  }, []);

  return ref;
} 