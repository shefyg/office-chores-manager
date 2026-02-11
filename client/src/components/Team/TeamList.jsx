import { useState, useEffect } from 'react';
import MemberForm from './MemberForm';
import Modal from '../common/Modal';
import { fetchTeam, deleteMember } from '../../services/api';

function TeamList() {
  const [team, setTeam] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const loadTeam = async () => {
    const data = await fetchTeam();
    setTeam(data);
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this team member? Their assigned chores will become unassigned.')) {
      await deleteMember(id);
      loadTeam();
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  const handleSave = () => {
    loadTeam();
    handleCloseForm();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Team Members</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add Member
        </button>
      </div>

      {team.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No team members</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new team member.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Add your first team member
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {team.map(member => (
              <li key={member.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    {member.email && (
                      <div className="text-sm text-gray-500">{member.email}</div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showForm && (
        <Modal onClose={handleCloseForm}>
          <MemberForm
            member={editingMember}
            onSave={handleSave}
            onCancel={handleCloseForm}
          />
        </Modal>
      )}
    </div>
  );
}

export default TeamList;
