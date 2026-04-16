export default function Card({ children }) {
  return (
    <div className="bg-[#1C2D3E] border border-[#2D4A63] rounded-2xl w-full max-w-md  p-10 flex flex-col">
      {children}
    </div>
  );
}
