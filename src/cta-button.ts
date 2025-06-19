import React from "react";
import ReactDOM from "react-dom/client";
import GruveEventWidgets from "./components/GruveEventsWidget";
import { CDN_KEY_FOR_SCRIPT } from "./utils/utils";

export function GruveCDNCta() {
  if (typeof window === "undefined") return;

  window.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".gruve-cta-button");

    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();

        const eventAddress = btn.getAttribute("data-gruve-event-address");
        const isTest = btn.getAttribute("data-gruve-test") === "true";
        const themeColor = btn.getAttribute("data-gruve-theme-color") || "";
        const color = btn.getAttribute("data-gruve-button-text-color") || "";

        if (!eventAddress) return;

        const container = document.createElement("div");
        document.body.appendChild(container);

        const root = ReactDOM.createRoot(container);
        root.render(
          React.createElement(GruveEventWidgets, {
            eventAddress,
            isTest,
            triggerOnMountValue: CDN_KEY_FOR_SCRIPT,
            config: {
              themeColor,
              color,
            },
          })
        );
      });
    });
  });
}
