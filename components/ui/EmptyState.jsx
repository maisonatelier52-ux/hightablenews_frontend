export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="h-14 w-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
        {Icon && <Icon size={24} strokeWidth={1.8} />}
      </div>
      <h2 className="text-[16px] font-bold text-ink-900 tracking-[-0.01em]">{title}</h2>
      <p className="text-[13.5px] text-ink-500 mt-1.5 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
