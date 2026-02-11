import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CalendarView from './components/Calendar/CalendarView';
import TeamList from './components/Team/TeamList';
import HistoryView from './components/History/HistoryView';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Office Chores</h1>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Calendar</a>
                <a href="/team" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Team</a>
                <a href="/history" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">History</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<CalendarView />} />
            <Route path="/team" element={<TeamList />} />
            <Route path="/history" element={<HistoryView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
