import DayCell from './DayCell';
import { getMonthDays, isSameDay } from '../../utils/dateUtils';
import { expandRecurrence } from '../../utils/recurrence';

function MonthView({ currentDate, chores, team, onDateClick, onChoreClick }) {
  const days = getMonthDays(currentDate);
  const today = new Date();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getChoresForDate = (date) => {
    return chores.flatMap(chore => {
      const occurrences = expandRecurrence(chore, date, date);
      return occurrences.map(occ => ({
        ...chore,
        displayDate: occ
      }));
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-7 border-b">
        {weekDays.map(day => (
          <div key={day} className="py-3 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, index) => (
          <DayCell
            key={index}
            date={day.date}
            isCurrentMonth={day.isCurrentMonth}
            isToday={isSameDay(day.date, today)}
            chores={getChoresForDate(day.date)}
            team={team}
            onClick={() => onDateClick(day.date)}
            onChoreClick={onChoreClick}
          />
        ))}
      </div>
    </div>
  );
}

export default MonthView;
