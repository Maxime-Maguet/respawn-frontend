import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateLibrary } from "../../api/library";

export default function JournalModal({ libraryEntry, onClose }) {
  const queryClient = useQueryClient();

  const [journalInput, setJournalInput] = useState({
    note: "",
    heure: 0,
    minutes: 0,
  });
  const [showForm, setShowForm] = useState(false);

  const updateMutation = useMutation({
    mutationFn: ({ id, journal }) => updateLibrary(id, { journal }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
      setJournalInput({ note: "", heure: 0, minutes: 0 });
      setShowForm(false);
    },
    onError: (err) => console.error(err),
  });

  const handleAddSession = () => {
    const newJournal = [
      ...libraryEntry.journal,
      {
        date: new Date(),
        note: journalInput.note,
        duration: journalInput.heure * 60 + journalInput.minutes,
      },
    ];
    updateMutation.mutate({ id: libraryEntry._id, journal: newJournal });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h${String(m).padStart(2, "0")}`;
  };

  const orderedJournal = [...libraryEntry.journal].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const sumPlayTime = libraryEntry?.journal?.reduce(
    (acc, currentValue) => acc + (currentValue.duration || 0),
    0,
  );

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
        className="rounded-2xl p-5 w-96 max-h-[85vh] overflow-y-auto custom-scroll flex flex-col gap-4"
        style={{
          background: "linear-gradient(180deg, #0f1923 0%, #0a1018 100%)",
          border: "1px solid #2D4A63",
          boxShadow:
            "0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(91,33,182,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2D4A63]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#5B21B6] to-[#7C3AED] flex items-center justify-center text-sm">
              📓
            </div>
            <h1 className="text-[#F1F5F8] font-['Orbitron'] text-xs font-bold uppercase tracking-widest">
              Journal de sessions
            </h1>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-[#2D4A63] text-[#4a6078] hover:border-[#7C3AED]/60 hover:text-[#a78bfa] transition-all duration-200 text-xs cursor-pointer flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* TOTAL */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[#0d9488]/35 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,148,136,0.12), rgba(13,148,136,0.04))",
          }}
        >
          <div className="absolute top-0 left-0 w-0.75 h-full bg-linear-to-b from-[#0d9488] to-[#14b8a6]" />
          <p className="text-[#14b8a6] font-['Orbitron'] text-2xl font-bold">
            {formatDuration(sumPlayTime)}
          </p>
          <span className="text-[#4a6078] text-[10px] uppercase tracking-widest font-bold">
            temps total
            <br />
            de jeu
          </span>
        </div>

        {/* BOUTON NOUVELLE SESSION */}
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center justify-center gap-2 w-full text-xs font-bold py-2.5 rounded-xl border border-[#2D4A63] text-[#94A3B8] hover:border-[#5B21B6] hover:text-[#a78bfa] transition-all duration-200 cursor-pointer uppercase tracking-widest"
        >
          <span className="w-4.5 h-4.5 rounded-full bg-[#5B21B6]/20 border border-[#7C3AED]/40 text-[#a78bfa] flex items-center justify-center text-xs font-bold">
            {showForm ? " − " : "+"}
          </span>
          {showForm ? "Annuler" : "Nouvelle session"}
        </button>

        {/* FORMULAIRE */}
        {showForm && (
          <div className="flex flex-col gap-3.5 p-4 rounded-xl border border-[#1a2d40] bg-[#060a0f]">
            <div className="flex gap-2.5">
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="text-[#4a6078] text-[9px] uppercase tracking-widest font-bold">
                  Heures
                </span>
                <input
                  name="hours"
                  type="number"
                  placeholder="0"
                  onChange={(e) =>
                    setJournalInput((prev) => ({
                      ...prev,
                      heure: Number(e.target.value),
                    }))
                  }
                  className="bg-[#0a1520] border border-[#2D4A63] rounded-lg text-[#F1F5F8] text-sm px-3 py-2 outline-none focus:border-[#5B21B6] transition-colors w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="text-[#4a6078] text-[9px] uppercase tracking-widest font-bold">
                  Minutes
                </span>
                <input
                  name="minutes"
                  type="number"
                  placeholder="0"
                  onChange={(e) =>
                    setJournalInput((prev) => ({
                      ...prev,
                      minutes: Number(e.target.value),
                    }))
                  }
                  className="bg-[#0a1520] border border-[#2D4A63] rounded-lg text-[#F1F5F8] text-sm px-3 py-2 outline-none focus:border-[#5B21B6] transition-colors w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[#4a6078] text-[9px] uppercase tracking-widest font-bold">
                Note de session
              </span>
              <textarea
                name="note"
                placeholder="Comment s'est passée cette session ?"
                onChange={(e) =>
                  setJournalInput((prev) => ({ ...prev, note: e.target.value }))
                }
                className="bg-[#0a1520] border border-[#2D4A63] rounded-lg text-[#F1F5F8] text-sm px-3 py-2 outline-none focus:border-[#5B21B6] transition-colors w-full resize-none placeholder:text-[#2D4A63]"
                rows={3}
              />
            </div>
            <button
              onClick={() => handleAddSession()}
              className="w-full text-xs font-bold py-2.5 rounded-xl text-white transition-all duration-200 cursor-pointer uppercase tracking-widest"
              style={{
                background: "linear-gradient(135deg, #5B21B6, #7C3AED)",
                boxShadow: "0 4px 14px rgba(91,33,182,0.35)",
              }}
            >
              Confirmer
            </button>
          </div>
        )}

        {/* SESSIONS RÉCENTES */}
        <div className="text-[#4a6078] text-[9px] uppercase tracking-widest font-bold">
          Sessions récentes
        </div>
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto custom-scroll pr-1">
          {orderedJournal.map((item) => (
            <div
              key={item._id}
              className="bg-[#060a0f] border border-[#1a2d40] rounded-xl p-3 flex flex-col gap-2 relative"
            >
              <div className="absolute top-3 left-0 w-0.5 h-[calc(100%-24px)] bg-[#2D4A63] rounded-r" />
              <div className="flex justify-between items-center pl-2">
                <span className="text-[#94A3B8] text-[11px] font-medium">
                  {new Date(item.date).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {item.duration > 0 && (
                  <span className="text-[#14b8a6] text-[10px] font-bold bg-[#0d9488]/12 border border-[#0d9488]/30 rounded-md px-2 py-0.5 font-['Orbitron'] tracking-wider">
                    {formatDuration(item.duration)}
                  </span>
                )}
              </div>
              {item.note && (
                <p className="text-[#94A3B8] text-xs leading-relaxed pl-2">
                  {item.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
