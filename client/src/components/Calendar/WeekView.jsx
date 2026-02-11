import { getWeekDays, isSameDay, formatDate } from '../../utils/dateUtils';
import { expandRecurrence } from '../../utils/recurrence';
import ChoreCard from '../Chores/ChoreCard';

function WeekView({ currentDate, chores, team, onDateClick, onChoreClick }) {
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
                  <ChoreCard
                    key={`${chore.id}-${idx}`}
                    chore={chore}
                    member={getMember(chore.assigneeId)}
                    onClick={() => onChoreClick(chore)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeekView;
