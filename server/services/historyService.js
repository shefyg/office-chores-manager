import { readData } from './storage.js';

const FILENAME = 'history.json';

export async function getAllHistory() {
  return readData(FILENAME);
}

export async function getHistoryByMember(memberId) {
  const history = await readData(FILENAME);
  return history.filter(h => h.completedBy === memberId);
}

export async function getHistoryByChore(choreId) {
  const history = await readData(FILENAME);
  return history.filter(h => h.choreId === choreId);
}
