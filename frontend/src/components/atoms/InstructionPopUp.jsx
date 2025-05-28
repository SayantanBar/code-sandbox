import React, { useState, useRef, useEffect } from "react";

export const InstructionPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="mt-1 p-1 bg-[#2B3137] text-white rounded hover:bg-blue-700"
      >
        How to run your project
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-lg font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">
              How to Run the Project
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                Go to the <strong>sandbox</strong> folder
              </li>
              <li>
                In the terminal, run:
                <br />
                <code className="bg-gray-100 px-2 py-1 rounded inline-block mt-1">
                  npm run dev -- --host 0.0.0.0
                </code>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
