const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Team endpoints
export async function fetchTeam() {
  return request('/team');
}

export async function createMember(data) {
  return request('/team', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateMember(id, data) {
  return request(`/team/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteMember(id) {
  return request(`/team/${id}`, {
    method: 'DELETE'
  });
}

// Chore endpoints
export async function fetchChores(start, end) {
  let url = '/chores';
  if (start && end) {
    url += `?start=${start}&end=${end}`;
  }
  return request(url);
}

export async function createChore(data) {
  return request('/chores', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateChore(id, data) {
  return request(`/chores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteChore(id) {
  return request(`/chores/${id}`, {
    method: 'DELETE'
  });
}

export async function completeChore(id, notes) {
  return request(`/chores/${id}/complete`, {
    method: 'POST',
    body: JSON.stringify({ notes })
  });
}

// History endpoints
export async function fetchHistory() {
  return request('/history');
}
