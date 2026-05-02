export default function Button({
  onClick,
  text,
  disabled,
  className,
  variant = "primary",
}) {
  const variants = {
    primary: "bg-[#5B21B6] hover:bg-[#6D28D9]",
    success: "bg-[#0d9488] hover:bg-[#0a7c74]",
  };
  return (
    <button
      className={`${variants[variant]} rounded-lg p-4 text-center text-[#F1F5F8] font-semibold text-sm tracking-wide
        transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 focus-visible:ring-2 focus-visible:ring-violet-500/50 ${className ?? ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
