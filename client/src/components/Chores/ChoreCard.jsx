function ChoreCard({ chore, member, compact, onClick }) {
  const priorityColors = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-green-500'
  };

  const statusStyles = chore.status === 'completed' ? 'opacity-60 line-through' : '';

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`text-xs p-1 rounded border-l-2 ${priorityColors[chore.priority] || 'border-l-gray-300'} bg-white shadow-sm cursor-pointer hover:shadow ${statusStyles}`}
        style={{ borderLeftColor: member?.color }}
      >
        <div className="truncate">{chore.dueTime && <span className="font-medium">{chore.dueTime} </span>}{chore.title}</div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`p-2 rounded border-l-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow ${statusStyles}`}
      style={{ borderLeftColor: member?.color || '#9CA3AF' }}
    >
      <div className="flex items-start justify-between">
        <div className="font-medium text-sm truncate">{chore.title}</div>
        {chore.priority && (
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            chore.priority === 'high' ? 'bg-red-100 text-red-700' :
            chore.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {chore.priority}
          </span>
        )}
      </div>
      {member && (
        <div className="text-xs text-gray-500 mt-1 flex items-center">
          <span
            className="w-2 h-2 rounded-full mr-1"
            style={{ backgroundColor: member.color }}
          />
          {member.name}
        </div>
      )}
    </div>
  );
}

export default ChoreCard;
