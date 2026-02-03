import { useEffect } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

export function useTour() {
  useEffect(() => {
    // Verificar si ya vio el tour
    const hasSeenTour = localStorage.getItem("neura-tour-completed");
    if (hasSeenTour) return;

    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        classes: "shadow-lg rounded-lg",
        scrollTo: { behavior: "smooth", block: "center" },
      },
    });

    tour.addStep({
      id: "welcome",
      text: "¡Bienvenido a Neura! Te mostraré cómo funciona.",
      buttons: [
        {
          text: "Empezar",
          action: tour.next,
        },
      ],
    });

    tour.addStep({
      id: "sidebar",
      attachTo: { element: "aside", on: "right" },
      text: "Aquí están tus notas y puedes crear nuevas páginas.",
      buttons: [
        { text: "Atrás", action: tour.back },
        { text: "Siguiente", action: tour.next },
      ],
    });

    tour.addStep({
      id: "new-note",
      attachTo: { element: "#new-page-btn", on: "right" },
      text: "Haz clic aquí para crear una nueva nota.",
      buttons: [
        { text: "Atrás", action: tour.back },
        { text: "Siguiente", action: tour.next },
      ],
    });

    tour.addStep({
      id: "chat",
      attachTo: { element: "aside button:nth-child(2)", on: "right" },
      text: "Usa el chat para preguntarle a la IA sobre tus notas.",
      buttons: [
        { text: "Atrás", action: tour.back },
        { text: "Terminar", action: tour.complete },
      ],
    });

    tour.on("complete", () => {
      localStorage.setItem("neura-tour-completed", "true");
    });

    tour.on("cancel", () => {
      localStorage.setItem("neura-tour-completed", "true");
    });

    // Esperar a que el DOM esté listo
    setTimeout(() => tour.start(), 500);

    return () => tour.complete();
  }, []);
}
