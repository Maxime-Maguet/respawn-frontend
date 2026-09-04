export default function Card({ children }) {
  return (
    <div className="flex w-full max-w-md flex-col rounded-2xl border border-[#2D4A63] bg-[#1C2D3E] px-6 pb-16 pt-8 shadow-[0_0_25px_rgba(91,33,182,0.15)] sm:px-10 sm:pb-20 sm:pt-10">
      {children}
    </div>
  );
}
