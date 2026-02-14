import { useState } from 'react';
import { createChore, updateChore } from '../../services/api';
import { formatDateForInput } from '../../utils/dateUtils';

function ChoreForm({ chore, team, initialDate, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: chore?.title || '',
    description: chore?.description || '',
    assigneeId: chore?.assigneeId || '',
    priority: chore?.priority || 'medium',
    color: chore?.color || '',
    notes: chore?.notes || '',
    dueDate: chore?.dueDate || (initialDate ? formatDateForInput(initialDate) : formatDateForInput(new Date())),
    dueTime: chore?.dueTime || '',
    recurrence: chore?.recurrence || null
  });

  const [recurrenceEnabled, setRecurrenceEnabled] = useState(!!chore?.recurrence);
  const [recurrenceType, setRecurrenceType] = useState(chore?.recurrence?.type || 'weekly');
  const [recurrenceDays, setRecurrenceDays] = useState(chore?.recurrence?.daysOfWeek || [1]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      recurrence: recurrenceEnabled ? {
        type: recurrenceType,
        daysOfWeek: recurrenceType === 'weekly' ? recurrenceDays : undefined
      } : null
    };

    if (chore?.id) {
      await updateChore(chore.id, data);
    } else {
      await createChore(data);
    }
    onSave();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleDay = (day) => {
    setRecurrenceDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };

  const weekDays = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        {chore ? 'Edit Chore' : 'Add New Chore'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter chore title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the chore"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date *
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            name="dueTime"
            value={formData.dueTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign To
          </label>
          <select
            name="assigneeId"
            value={formData.assigneeId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Unassigned</option>
            {team.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={formData.color || '#3b82f6'}
            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            className="w-10 h-10 rounded cursor-pointer border border-gray-300"
          />
          {formData.color && (
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, color: '' }))}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear
            </button>
          )}
          {!formData.color && (
            <span className="text-xs text-gray-400">No color set</span>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={recurrenceEnabled}
            onChange={(e) => setRecurrenceEnabled(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Make this a recurring chore</span>
        </label>
      </div>

      {recurrenceEnabled && (
        <div className="pl-4 border-l-2 border-blue-200 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repeat
            </label>
            <select
              value={recurrenceType}
              onChange={(e) => setRecurrenceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {recurrenceType === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                On these days
              </label>
              <div className="flex space-x-1">
                {weekDays.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`w-10 h-10 rounded-full text-sm font-medium ${
                      recurrenceDays.includes(day.value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Additional notes"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {chore ? 'Update' : 'Create'} Chore
        </button>
      </div>
    </form>
  );
}

export default ChoreForm;
