export default function ErrorBox({ errors }) {
  const errorItems = errors.map((err, i) => {
    return <p key={i}>{err}</p>;
  });

  return (
    <div className="min-h-14">
      {errors.length > 0 && (
        <div className="bg-red-500/10 border border-[#EF4444] rounded-[6px] px-4 py-2.5 text-[#EF4444] text-xs">
          {errorItems}
        </div>
      )}
    </div>
  );
}
