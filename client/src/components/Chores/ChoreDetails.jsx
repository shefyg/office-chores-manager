import { useState } from 'react';
import { deleteChore, completeChore } from '../../services/api';
import ChoreForm from './ChoreForm';

function ChoreDetails({ chore, team, onUpdate, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const member = team.find(m => m.id === chore.assigneeId);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this chore?')) {
      setIsDeleting(true);
      await deleteChore(chore.id);
      onUpdate();
    }
  };

  const handleComplete = async () => {
    await completeChore(chore.id);
    onUpdate();
  };

  if (isEditing) {
    return (
      <ChoreForm
        chore={chore}
        team={team}
        onSave={() => {
          setIsEditing(false);
          onUpdate();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const priorityLabel = {
    high: { text: 'High Priority', class: 'bg-red-100 text-red-700' },
    medium: { text: 'Medium Priority', class: 'bg-yellow-100 text-yellow-700' },
    low: { text: 'Low Priority', class: 'bg-green-100 text-green-700' }
  };

  const recurrenceLabel = () => {
    if (!chore.recurrence) return null;
    const type = chore.recurrence.type;
    if (type === 'daily') return 'Repeats daily';
    if (type === 'monthly') return 'Repeats monthly';
    if (type === 'weekly') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const selectedDays = (chore.recurrence.daysOfWeek || []).map(d => days[d]).join(', ');
      return `Repeats weekly on ${selectedDays}`;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className={`text-xl font-semibold text-gray-900 ${chore.status === 'completed' ? 'line-through opacity-60' : ''}`}>
            {chore.title}
          </h2>
          {chore.status === 'completed' && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
              Completed
            </span>
          )}
        </div>
        <span className={`px-2 py-1 text-xs rounded ${priorityLabel[chore.priority]?.class || 'bg-gray-100'}`}>
          {priorityLabel[chore.priority]?.text || 'No Priority'}
        </span>
      </div>

      {chore.description && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
          <p className="text-gray-700">{chore.description}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
          <p className="text-gray-700">
            {new Date(chore.dueDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            {chore.dueTime && ` at ${chore.dueTime}`}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned To</h3>
          {member ? (
            <div className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: member.color }}
              />
              <span className="text-gray-700">{member.name}</span>
            </div>
          ) : (
            <p className="text-gray-400">Unassigned</p>
          )}
        </div>
      </div>

      {chore.recurrence && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Recurrence</h3>
          <p className="text-gray-700">{recurrenceLabel()}</p>
        </div>
      )}

      {chore.notes && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Notes</h3>
          <p className="text-gray-700">{chore.notes}</p>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          Delete
        </button>
        <div className="space-x-3">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Edit
          </button>
          {chore.status !== 'completed' && (
            <button
              onClick={handleComplete}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Mark Complete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChoreDetails;
