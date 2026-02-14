import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from './storage.js';

const CHORES_FILE = 'chores.json';
const HISTORY_FILE = 'history.json';

export async function getAllChores() {
  return readData(CHORES_FILE);
}

export async function getChoreById(id) {
  const chores = await readData(CHORES_FILE);
  return chores.find(c => c.id === id);
}

export async function createChore(data) {
  const chores = await readData(CHORES_FILE);
  const newChore = {
    id: uuidv4(),
    title: data.title,
    description: data.description || '',
    assigneeId: data.assigneeId || null,
    priority: data.priority || 'medium',
    notes: data.notes || '',
    status: 'pending',
    dueDate: data.dueDate,
    dueTime: data.dueTime || null,
    recurrence: data.recurrence || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  chores.push(newChore);
  await writeData(CHORES_FILE, chores);
  return newChore;
}

export async function updateChore(id, data) {
  const chores = await readData(CHORES_FILE);
  const index = chores.findIndex(c => c.id === id);
  if (index === -1) {
    return null;
  }
  chores[index] = {
    ...chores[index],
    title: data.title ?? chores[index].title,
    description: data.description ?? chores[index].description,
    assigneeId: data.assigneeId !== undefined ? data.assigneeId : chores[index].assigneeId,
    priority: data.priority ?? chores[index].priority,
    notes: data.notes ?? chores[index].notes,
    status: data.status ?? chores[index].status,
    dueDate: data.dueDate ?? chores[index].dueDate,
    dueTime: data.dueTime !== undefined ? data.dueTime : chores[index].dueTime,
    recurrence: data.recurrence !== undefined ? data.recurrence : chores[index].recurrence,
    updatedAt: new Date().toISOString()
  };
  await writeData(CHORES_FILE, chores);
  return chores[index];
}

export async function deleteChore(id) {
  const chores = await readData(CHORES_FILE);
  const index = chores.findIndex(c => c.id === id);
  if (index === -1) {
    return false;
  }
  chores.splice(index, 1);
  await writeData(CHORES_FILE, chores);
  return true;
}

export async function completeChore(id, notes) {
  const chores = await readData(CHORES_FILE);
  const index = chores.findIndex(c => c.id === id);
  if (index === -1) {
    return null;
  }

  const chore = chores[index];
  const team = await readData('team.json');
  const member = team.find(m => m.id === chore.assigneeId);

  // Add to history
  const history = await readData(HISTORY_FILE);
  const historyEntry = {
    id: uuidv4(),
    choreId: chore.id,
    choreTitle: chore.title,
    completedBy: chore.assigneeId,
    completedByName: member?.name || 'Unknown',
    completedAt: new Date().toISOString(),
    notes: notes || ''
  };
  history.unshift(historyEntry);
  await writeData(HISTORY_FILE, history);

  // Mark chore as completed
  chores[index] = {
    ...chore,
    status: 'completed',
    updatedAt: new Date().toISOString()
  };
  await writeData(CHORES_FILE, chores);

  return { chore: chores[index], historyEntry };
}
