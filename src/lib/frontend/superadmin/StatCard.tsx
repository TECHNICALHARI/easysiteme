export default function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white border border-muted rounded-xl p-4 shadow-sm">
      <div className="text-2xl">{icon}</div>
      <div className="text-sm text-muted-text mt-2">{label}</div>
      <div className="text-xl font-bold text-brand mt-1">{value}</div>
    </div>
  );
}
