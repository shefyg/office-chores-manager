import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from './storage.js';

const FILENAME = 'team.json';

export async function getAllMembers() {
  return readData(FILENAME);
}

export async function getMemberById(id) {
  const members = await readData(FILENAME);
  return members.find(m => m.id === id);
}

export async function createMember(data) {
  const members = await readData(FILENAME);
  const newMember = {
    id: uuidv4(),
    name: data.name,
    email: data.email || '',
    color: data.color || '#3B82F6',
    createdAt: new Date().toISOString()
  };
  members.push(newMember);
  await writeData(FILENAME, members);
  return newMember;
}

export async function updateMember(id, data) {
  const members = await readData(FILENAME);
  const index = members.findIndex(m => m.id === id);
  if (index === -1) {
    return null;
  }
  members[index] = {
    ...members[index],
    name: data.name ?? members[index].name,
    email: data.email ?? members[index].email,
    color: data.color ?? members[index].color
  };
  await writeData(FILENAME, members);
  return members[index];
}

export async function deleteMember(id) {
  const members = await readData(FILENAME);
  const index = members.findIndex(m => m.id === id);
  if (index === -1) {
    return false;
  }
  members.splice(index, 1);
  await writeData(FILENAME, members);

  // Unassign chores from this member
  const chores = await readData('chores.json');
  const updatedChores = chores.map(chore => {
    if (chore.assigneeId === id) {
      return { ...chore, assigneeId: null };
    }
    return chore;
  });
  await writeData('chores.json', updatedChores);

  return true;
}
