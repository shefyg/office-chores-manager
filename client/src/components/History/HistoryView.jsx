import { useState, useEffect } from 'react';
import { fetchHistory, fetchTeam } from '../../services/api';
import { useSync } from '../../hooks/useSync';

function HistoryView() {
  const [history, setHistory] = useState([]);
  const [team, setTeam] = useState([]);
  const [filter, setFilter] = useState('all');

  const loadData = async () => {
    const [historyData, teamData] = await Promise.all([
      fetchHistory(),
      fetchTeam()
    ]);
    setHistory(historyData);
    setTeam(teamData);
  };

  useSync(['history'], loadData);

  useEffect(() => {
    loadData();
  }, []);

  const getMember = (id) => team.find(m => m.id === id);

  const filteredHistory = filter === 'all'
    ? history
    : history.filter(h => h.completedBy === filter);

  const groupedByDate = filteredHistory.reduce((groups, item) => {
    const date = new Date(item.completedAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Completion History</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Members</option>
          {team.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No completed chores yet</h3>
          <p className="mt-1 text-sm text-gray-500">Completed chores will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, items]) => (
            <div key={date} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-3 bg-gray-50 border-b">
                <h3 className="text-sm font-medium text-gray-500">{date}</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {items.map(item => {
                  const member = getMember(item.completedBy);
                  return (
                    <li key={item.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.choreTitle}</div>
                            {item.notes && (
                              <div className="text-sm text-gray-500">{item.notes}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          {member && (
                            <>
                              <span
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: member.color }}
                              />
                              {member.name}
                            </>
                          )}
                          {!member && item.completedByName && (
                            <span className="text-gray-400">{item.completedByName}</span>
                          )}
                          <span className="mx-2">•</span>
                          {new Date(item.completedAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryView;
