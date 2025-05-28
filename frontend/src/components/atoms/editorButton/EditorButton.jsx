export const EditorButton = ({ active = false, filename, onClick }) => {
  return (
    <div className="flex">
      <button
        onClick={onClick}
        className={`
          w-40
          h-8
          
          px-3
          flex items-center
          text-sm
          truncate
          
          
          ${
            active
              ? "bg-[#304e6b] text-white"
              : "bg-[#2B3137] text-gray-300 border-gray-600"
          }
          hover:bg-[#3a3a3a] hover:text-white
          transition-colors
          text-left
        `}
      >
        {filename}
      </button>
    </div>
  );
};
