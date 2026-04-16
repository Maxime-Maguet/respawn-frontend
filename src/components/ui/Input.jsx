export default function Input({ label, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-semibold text-[#94A3B8]">{label}</label>
      <input
        className="w-full bg-[#0a121c] border border-[#2D4A63] rounded-lg px-4 py-3 text-sm text-[#F1F5F8] placeholder:text-[#475569] focus:outline-none focus:border-violet-500 transition-colors autofill:bg-[#0a121c] autofill:shadow-[inset_0_0_0px_1000px_#0a121c] autofill:[-webkit-text-fill-color:#F1F5F8]"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
      ></input>
    </div>
  );
}
