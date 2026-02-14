import { useState, useEffect } from 'react';
import MonthView from './MonthView';
import WeekView from './WeekView';
import ChoreForm from '../Chores/ChoreForm';
import ChoreDetails from '../Chores/ChoreDetails';
import Modal from '../common/Modal';
import { fetchChores, fetchTeam } from '../../services/api';

function CalendarView() {
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [chores, setChores] = useState([]);
  const [team, setTeam] = useState([]);
  const [showChoreForm, setShowChoreForm] = useState(false);
  const [selectedChore, setSelectedChore] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterMemberId, setFilterMemberId] = useState('');

  const filteredChores = filterMemberId
    ? chores.filter(chore => chore.assigneeId === filterMemberId)
    : chores;

  const loadData = async () => {
    const [choresData, teamData] = await Promise.all([
      fetchChores(),
      fetchTeam()
    ]);
    setChores(choresData);
    setTeam(teamData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowChoreForm(true);
  };

  const handleChoreClick = (chore) => {
    setSelectedChore(chore);
  };

  const handleCloseForm = () => {
    setShowChoreForm(false);
    setSelectedDate(null);
  };

  const handleCloseDetails = () => {
    setSelectedChore(null);
  };

  const handleSave = () => {
    loadData();
    handleCloseForm();
  };

  const handleUpdate = () => {
    loadData();
    handleCloseDetails();
  };

  const formatHeader = () => {
    const options = view === 'month'
      ? { month: 'long', year: 'numeric' }
      : { month: 'short', day: 'numeric', year: 'numeric' };
    return currentDate.toLocaleDateString('en-US', options);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Today
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{formatHeader()}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                view === 'month'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                view === 'week'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
          </div>
          <select
            value={filterMemberId}
            onChange={(e) => setFilterMemberId(e.target.value)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <option value="">All Members</option>
            {team.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowChoreForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add Chore
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Hold <kbd className="px-1.5 py-0.5 bg-blue-100 border border-blue-300 rounded text-xs font-mono font-semibold">Shift</kbd> and hover over a chore to quickly preview its details</span>
      </div>

      {view === 'month' ? (
        <MonthView
          currentDate={currentDate}
          chores={filteredChores}
          team={team}
          onDateClick={handleDateClick}
          onChoreClick={handleChoreClick}
        />
      ) : (
        <WeekView
          currentDate={currentDate}
          chores={filteredChores}
          team={team}
          onDateClick={handleDateClick}
          onChoreClick={handleChoreClick}
        />
      )}

      {showChoreForm && (
        <Modal onClose={handleCloseForm}>
          <ChoreForm
            team={team}
            initialDate={selectedDate}
            onSave={handleSave}
            onCancel={handleCloseForm}
          />
        </Modal>
      )}

      {selectedChore && (
        <Modal onClose={handleCloseDetails}>
          <ChoreDetails
            chore={selectedChore}
            team={team}
            onUpdate={handleUpdate}
            onClose={handleCloseDetails}
          />
        </Modal>
      )}
    </div>
  );
}

export default CalendarView;
