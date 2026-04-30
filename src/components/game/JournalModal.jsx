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
  console.log("JournalModal=>", libraryEntry?.journal);

  const formatDuration = (minutes) => {
    if (!minutes) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h${String(m).padStart(2, "0")}`;
  };

  return (
    <>
      <div
        className="flex items-center justify-center "
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 50,
        }}
      >
        {/*HEADER*/}
        <div className="bg-[#0f1923] border  border-[#2D4A63] rounded-lg p-2 w-96 h-max overflow-y-auto">
          <div className="flex items-center justify-between px-2 py-3">
            <h1 className="text-[#F1F5F8] font-['Orbitron'] text-sm font-bold uppercase tracking-widest">
              JOURNAL DE SESSIONS
            </h1>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full border border-[#2D4A63] text-[#4a6078] hover:border-[#7C3AED]/60 hover:text-[#a78bfa] transition-all duration-200 text-xs cursor-pointer flex items-center justify-center"
            >
              X
            </button>
          </div>

          {/*NEW SESSIONS */}
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="w-full text-xs font-semibold py-2.5 rounded-lg border border-[#2D4A63] text-[#4a6078] hover:border-[#5B21B6] hover:text-[#a78bfa] transition-all duration-200 cursor-pointer"
          >
            {showForm ? "- Annuler" : "+ Nouvelle Session"}
          </button>
          {showForm && (
            <div className="flex flex-col gap-3 p-4 rounded-lg border border-[#1a2d40] bg-[#060a0f] mt-2 ">
              <div className="flex gap-6 justify-center ">
                <div className="flex flex-col">
                  <span className="text-[#4a6078] text-xs uppercase tracking-wider">
                    HEURES
                  </span>
                  <input
                    name="hours"
                    type="number"
                    onChange={(e) =>
                      setJournalInput((prev) => ({
                        ...prev,
                        heure: Number(e.target.value),
                      }))
                    }
                    className="bg-[#1C2D3E] border border-[#2D4A63] rounded-lg text-[#F1F5F8] text-sm px-3 py-2 outline-none focus:border-[#5B21B6] transition-colors w-24"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#4a6078] text-xs uppercase tracking-wider">
                    MINUTES
                  </span>
                  <input
                    name="minutes"
                    type="number"
                    onChange={(e) =>
                      setJournalInput((prev) => ({
                        ...prev,
                        minutes: Number(e.target.value),
                      }))
                    }
                    className="bg-[#1C2D3E] border border-[#2D4A63] rounded-lg text-[#F1F5F8] text-sm px-3 py-2 outline-none focus:border-[#5B21B6] transition-colors w-24"
                  />
                </div>
              </div>
              <div>
                <span className="text-[#4a6078] text-xs uppercase tracking-wider">
                  Notes de session
                </span>

                <textarea
                  name="note"
                  onChange={(e) =>
                    setJournalInput((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                  className="bg-[#1C2D3E] border border-[#2D4A63] rounded-lg text-[#F1F5F8] text-sm px-3 py-2 outline-none focus:border-[#5B21B6] transition-colors w-full"
                />
              </div>

              <button
                onClick={() => handleAddSession()}
                className="w-full text-xs font-bold py-2.5 rounded-lg bg-[#5B21B6] hover:bg-[#7C3AED] text-white transition-all duration-200 cursor-pointer uppercase tracking-widest"
              >
                CONFIRMER
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-3 max-h-62  custom-scroll overflow-y-auto">
            <h3 className="text-[#4a6078] text-xs  tracking-wider uppercase">
              sessions récentes
            </h3>
            {libraryEntry?.journal.map((item) => (
              <div key={item._id}>
                <div className="flex flex-col gap-2 p-3 rounded-lg border border-[#1a2d40] bg-[#060a0f]">
                  <div className="flex justify-between gap-2">
                    <span className="text-[#4a6078] text-xs uppercase tracking-wider">
                      {new Date(item.date).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="text-[#0d9488] text-xs uppercase tracking-wider ">
                      {formatDuration(item.duration)}
                    </span>
                  </div>

                  <p className="text-[#94A3B8] text-sm leading-relaxed">
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
