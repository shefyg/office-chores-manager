import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { getWeekDays, isSameDay, formatDate } from '../../utils/dateUtils';
import { expandRecurrence } from '../../utils/recurrence';
import ChoreCard from '../Chores/ChoreCard';
import ChorePreview from '../Chores/ChorePreview';

function WeekView({ currentDate, chores, team, onDateClick, onChoreClick }) {
  const [hoveredChore, setHoveredChore] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

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
  const days = getWeekDays(currentDate);
  const today = new Date();

  const getChoresForDate = (date) => {
    return chores.flatMap(chore => {
      const occurrences = expandRecurrence(chore, date, date);
      return occurrences.map(occ => ({
        ...chore,
        displayDate: occ
      }));
    });
  };

  const getMember = (assigneeId) => {
    return team.find(m => m.id === assigneeId);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-7 border-b">
        {days.map(day => (
          <div
            key={day.toISOString()}
            className={`py-3 text-center border-r last:border-r-0 ${
              isSameDay(day, today) ? 'bg-blue-50' : ''
            }`}
          >
            <div className="text-sm font-medium text-gray-500">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-2xl font-semibold ${
              isSameDay(day, today) ? 'text-blue-600' : 'text-gray-900'
            }`}>
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 min-h-[500px]">
        {days.map(day => {
          const dayChores = getChoresForDate(day);
          return (
            <div
              key={day.toISOString()}
              className={`border-r last:border-r-0 p-2 ${
                isSameDay(day, today) ? 'bg-blue-50' : ''
              }`}
              onClick={() => onDateClick(day)}
            >
              <div className="space-y-2">
                {dayChores.map((chore, idx) => (
                  <div
                    key={`${chore.id}-${idx}`}
                    onMouseMove={(e) => handleChoreMouseMove(e, chore)}
                    onMouseLeave={handleChoreMouseLeave}
                  >
                    <ChoreCard
                      chore={chore}
                      member={getMember(chore.assigneeId)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChoreClick(chore);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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

export default WeekView;
