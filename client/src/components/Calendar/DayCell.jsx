import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ChoreCard from '../Chores/ChoreCard';
import ChorePreview from '../Chores/ChorePreview';

function DayCell({ date, isCurrentMonth, isToday, chores, team, onClick, onChoreClick }) {
  const [hoveredChore, setHoveredChore] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getMember = (assigneeId) => {
    return team.find(m => m.id === assigneeId);
  };

  const handleKeyUp = useCallback((e) => {
    if (e.key === 'Shift') {
      setHoveredChore(null);
    }
  }, []);

  useEffect(() => {
    if (hoveredChore) {
      window.addEventListener('keyup', handleKeyUp);
      return () => window.removeEventListener('keyup', handleKeyUp);
    }
  }, [hoveredChore, handleKeyUp]);

  const handleChoreMouseMove = (e, chore) => {
    if (e.shiftKey) {
      setHoveredChore(chore);
      setHoveredMember(getMember(chore.assigneeId));
      setTooltipPos({ x: e.clientX + 12, y: e.clientY + 12 });
    } else {
      setHoveredChore(null);
    }
  };

  const handleChoreMouseLeave = () => {
    setHoveredChore(null);
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
          <div
            key={`${chore.id}-${idx}`}
            onMouseMove={(e) => handleChoreMouseMove(e, chore)}
            onMouseLeave={handleChoreMouseLeave}
          >
            <ChoreCard
              chore={chore}
              member={getMember(chore.assigneeId)}
              compact
              onClick={(e) => {
                e.stopPropagation();
                onChoreClick(chore);
              }}
            />
          </div>
        ))}
        {chores.length > 3 && (
          <div className="text-xs text-gray-500">+{chores.length - 3} more</div>
        )}
      </div>
      {hoveredChore && createPortal(
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 pointer-events-none"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <ChorePreview chore={hoveredChore} member={hoveredMember} />
        </div>,
        document.body
      )}
    </div>
  );
}

export default DayCell;
