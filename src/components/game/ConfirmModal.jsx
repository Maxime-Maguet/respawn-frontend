export default function ConfirmModal({ onClose, onConfirm }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(6, 10, 15, 0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 50,
      }}
    >
      <div
        className="rounded-2xl p-5 w-96 flex flex-col gap-4"
        style={{
          background: "linear-gradient(180deg, #0f1923 0%, #0a1018 100%)",
          border: "1px solid #2D4A63",
          boxShadow:
            "0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(91,33,182,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-[#2D4A63] text-[#4a6078] hover:border-[#7C3AED]/60 hover:text-[#a78bfa] transition-all duration-200 text-xs cursor-pointer flex items-center justify-center"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-[#F1F5F8] font-['Orbitron'] text-sm font-bold uppercase tracking-widest">
            Es-tu sûr de vouloir supprimer de ta bibliothèque ?
          </h1>
          <p className="text-[#4a6078] text-xs leading-relaxed">
            Attention si tu supprimes tu perdras toute ta progression
          </p>
        </div>
        <div
          className="w-12 h-0.5 rounded-full mx-auto"
          style={{ background: "#0d9488" }}
        />
        <div className="flex flex-col gap-3 mt-1">
          <button
            onClick={onConfirm}
            className="w-full text-xs font-bold py-3 rounded-xl text-white uppercase tracking-widest transition-all duration-200 cursor-pointer hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #5B21B6, #7C3AED)",
              boxShadow: "0 4px 14px rgba(91,33,182,0.35)",
            }}
          >
            Confirmer
          </button>
          <button
            onClick={onClose}
            className="w-full text-xs font-bold py-3 rounded-xl border border-[#7C3AED] text-[#a78bfa] uppercase tracking-widest transition-all duration-200 cursor-pointer hover:bg-[#5B21B6]/20 hover:border-[#a78bfa] hover:scale-[1.02] active:scale-[0.98]"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
