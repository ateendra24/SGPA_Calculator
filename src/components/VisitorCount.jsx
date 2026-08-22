import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";

function VisitorCount() {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      let targetCount = null;

      // Use sessionStorage to avoid hitting the API on every render
      const cached = sessionStorage.getItem("sgpa_visitor_count");
      if (cached !== null) {
        const parsed = Number(cached);
        if (!isNaN(parsed)) {
          targetCount = parsed;
        }
      }

      if (targetCount === null) {
        try {
          const res = await fetch("/api/visitors");
          if (res.ok) {
            const data = await res.json();
            if (data.count !== null && data.count !== undefined) {
              targetCount = data.count;
              sessionStorage.setItem("sgpa_visitor_count", String(data.count));
            }
          }
        } catch {
          // Fail silently — badge simply won't appear
        }
      }

      if (targetCount !== null) {
        setCount(0);
        setVisible(true);
        setTimeout(() => {
          setCount(targetCount);
        }, 100);
      }
    };

    fetchCount();
  }, []);

  if (!visible) return null;

  return (
    <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-600 select-none font-medium">
      {/* People icon */}
      <svg
        className="w-3.5 h-3.5 text-blue-400 shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM17 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 0 0-1.5-4.33A5 5 0 0 1 19 16v1h-6.07zM6 11a5 5 0 0 1 5 5v1H1v-1a5 5 0 0 1 5-5z" />
      </svg>
      <span>
        <NumberFlow value={count} spinTiming={{ duration: 600 }} /> students helped
      </span>
    </div>
  );
}

export default VisitorCount;
