export default function Card({ children }) {
  return (
    <div className="bg-[#1C2D3E] border border-[#2D4A63] rounded-2xl w-full max-w-md  px-10 pb-20 pt-10 flex flex-col shadow-[0_0_25px_rgba(91,33,182,0.15)]">
      {children}
    </div>
  );
}
