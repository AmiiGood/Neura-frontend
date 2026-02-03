function SyncIndicator({ status, lastSaved }) {
  const getStatusConfig = () => {
    switch (status) {
      case "saving":
        return {
          icon: (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ),
          text: "Guardando...",
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          dot: "bg-yellow-400",
        };
      case "unsaved":
        return {
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01"
              />
            </svg>
          ),
          text: "Sin guardar",
          color: "text-orange-600",
          bg: "bg-orange-50",
          dot: "bg-orange-400",
        };
      case "saved":
        return {
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
          text: lastSaved
            ? `Guardado ${lastSaved.toLocaleTimeString("es", {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "Guardado",
          color: "text-green-600",
          bg: "bg-green-50",
          dot: "bg-green-400",
        };
      case "error":
        return {
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ),
          text: "Error al guardar",
          color: "text-red-600",
          bg: "bg-red-50",
          dot: "bg-red-400",
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();

  if (!config) return null;

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg}`}
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}

export default SyncIndicator;
