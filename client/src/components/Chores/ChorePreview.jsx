function ChorePreview({ chore, member }) {
  const priorityLabel = {
    high: { text: 'High', class: 'bg-red-100 text-red-700' },
    medium: { text: 'Medium', class: 'bg-yellow-100 text-yellow-700' },
    low: { text: 'Low', class: 'bg-green-100 text-green-700' }
  };

  const recurrenceLabel = () => {
    if (!chore.recurrence) return null;
    const type = chore.recurrence.type;
    if (type === 'daily') return 'Repeats daily';
    if (type === 'monthly') return 'Repeats monthly';
    if (type === 'weekly') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const selectedDays = (chore.recurrence.daysOfWeek || []).map(d => days[d]).join(', ');
      return `Weekly on ${selectedDays}`;
    }
    return null;
  };

  return (
    <div className="w-64 p-3 space-y-2 text-sm">
      <div className="flex items-start justify-between gap-2">
        <span className={`font-semibold text-gray-900 flex items-center gap-1.5 ${chore.status === 'completed' ? 'line-through opacity-60' : ''}`}>
          {chore.color && (
            <span
              className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: chore.color }}
            />
          )}
          {chore.title}
        </span>
        <span className={`shrink-0 px-1.5 py-0.5 text-xs rounded ${priorityLabel[chore.priority]?.class || 'bg-gray-100'}`}>
          {priorityLabel[chore.priority]?.text || '—'}
        </span>
      </div>

      {chore.description && (
        <p className="text-gray-600 text-xs">{chore.description}</p>
      )}

      <div className="text-xs text-gray-500">
        {new Date(chore.dueDate).toLocaleDateString('en-US', {
          weekday: 'short', month: 'short', day: 'numeric'
        })}
        {chore.dueTime && ` at ${chore.dueTime}`}
      </div>

      {member ? (
        <div className="flex items-center text-xs text-gray-600">
          <span
            className="w-2.5 h-2.5 rounded-full mr-1.5"
            style={{ backgroundColor: member.color }}
          />
          {member.name}
        </div>
      ) : (
        <div className="text-xs text-gray-400">Unassigned</div>
      )}

      {chore.recurrence && (
        <div className="text-xs text-blue-600">{recurrenceLabel()}</div>
      )}

      {chore.notes && (
        <div className="text-xs text-gray-500 border-t pt-1 mt-1">{chore.notes}</div>
      )}
    </div>
  );
}

export default ChorePreview;
