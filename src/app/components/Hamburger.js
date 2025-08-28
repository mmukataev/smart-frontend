"use client";
import { useState, useEffect } from "react";
import LeftBar from "@/components/LeftBar";

export default function MenuWrapper() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <>
      <button 
        className="relative z-50 flex flex-col justify-between w-8 h-6 min-[1200px]:hidden"
        onClick={() => setOpen(!open)}
      >
      <svg class="vbp-header-menu-button__svg">
        <line x1="0" y1="50%" x2="100%" y2="50%" class="top" shape-rendering="crispEdges" />
        <line x1="0" y1="50%" x2="100%" y2="50%" class="middle" shape-rendering="crispEdges" />
        <line x1="0" y1="50%" x2="100%" y2="50%" class="bottom" shape-rendering="crispEdges" />
      </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex">

          <div 
            className="flex-1 bg-black/50" 
            onClick={() => setOpen(false)}
          />
          <LeftBar />
        </div>
      )}
    </>
  );
}
