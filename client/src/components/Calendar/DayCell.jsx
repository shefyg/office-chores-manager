import ChoreCard from '../Chores/ChoreCard';

function DayCell({ date, isCurrentMonth, isToday, chores, team, onClick, onChoreClick }) {
  const getMember = (assigneeId) => {
    return team.find(m => m.id === assigneeId);
  };

  return (
    <div
      className={`min-h-[120px] border-b border-r p-2 cursor-pointer hover:bg-gray-50 ${
        !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
      }`}
      onClick={onClick}
    >
      <div className={`text-sm font-medium mb-1 ${
        isToday
          ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center'
          : ''
      }`}>
        {date.getDate()}
      </div>
      <div className="space-y-1">
        {chores.slice(0, 3).map((chore, idx) => (
          <ChoreCard
            key={`${chore.id}-${idx}`}
            chore={chore}
            member={getMember(chore.assigneeId)}
            compact
            onClick={(e) => {
              e.stopPropagation();
              onChoreClick(chore);
            }}
          />
        ))}
        {chores.length > 3 && (
          <div className="text-xs text-gray-500">+{chores.length - 3} more</div>
        )}
      </div>
    </div>
  );
}

export default DayCell;
