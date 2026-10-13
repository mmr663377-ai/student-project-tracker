
const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#name');
const statusInput = document.querySelector('#status');
const projectList = document.querySelector('#project-list');
const emptyState = document.querySelector('#empty-state');
const message = document.querySelector('#message');
const saveButton = document.querySelector('#save-button');
const cancelButton = document.querySelector('#cancel-button');

let projects = [];
let editingId = null;
let loading = false;
let saving = false;

function showMessage(text) {
  message.textContent = text;
}

function updateControls() {
  saveButton.disabled = loading || saving;
  cancelButton.disabled = loading || saving;
  nameInput.disabled = loading || saving;
  statusInput.disabled = loading || saving;

  saveButton.textContent = saving
    ? 'Saving...'
    : editingId === null
      ? 'Add Project'
      : 'Save Changes';
}

function renderProjects() {
  projectList.replaceChildren();
  emptyState.hidden = projects.length > 0 || loading;

  for (const project of projects) {
    const item = document.createElement('li');
    const name = document.createElement('strong');
    const status = document.createElement('span');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    name.textContent = project.name;
    status.textContent = ` — ${project.status}`;

    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.disabled = loading || saving;
    editButton.addEventListener('click', () => startEditing(project));

    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.disabled = loading || saving;
    deleteButton.addEventListener('click', () => deleteProject(project));

    item.append(name, status, ' ', editButton, ' ', deleteButton);
    projectList.appendChild(item);
  }
}

async function readResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status}).`);
  }

  return data;
}

async function loadProjects({ quiet = false } = {}) {
  loading = true;
  updateControls();
  renderProjects();

  if (!quiet) showMessage('Loading projects...');

  try {
    const response = await fetch('/api/projects');
    const data = await readResponse(response);

    if (!Array.isArray(data)) {
      throw new Error('The server returned an invalid project list.');
    }

    projects = data;

    if (editingId !== null && !projects.some(p => p.id === editingId)) {
      resetForm();
    }

    renderProjects();

    if (!quiet) {
      showMessage(
        projects.length === 0
          ? 'No projects yet. Add your first project above.'
          : `Loaded ${projects.length} project(s).`
      );
    }
  } catch (error) {
    if (!quiet) {
      showMessage(`Could not load projects: ${error.message}`);
    } else {
      showMessage(`The change succeeded, but refreshing the list failed: ${error.message}`);
    }
  } finally {
    loading = false;
    updateControls();
    renderProjects();
  }
}

function resetForm() {
  editingId = null;
  form.reset();
  cancelButton.hidden = true;
  updateControls();
}

function startEditing(project) {
  editingId = project.id;
  nameInput.value = project.name;
  statusInput.value = project.status;
  cancelButton.hidden = false;
  updateControls();
  showMessage(`Editing ${project.name}.`);
  nameInput.focus();
}

cancelButton.addEventListener('click', () => {
  resetForm();
  showMessage('Edit cancelled.');
});

form.addEventListener('submit', async event => {
  event.preventDefault();

  if (saving || loading) return;

  const name = nameInput.value.trim();
  const status = statusInput.value;

  if (!name) {
    showMessage('Enter a project name.');
    nameInput.focus();
    return;
  }

  const isEditing = editingId !== null;
  const targetId = editingId;
  const url = isEditing
    ? `/api/projects/${encodeURIComponent(targetId)}`
    : '/api/projects';
  const method = isEditing ? 'PUT' : 'POST';

  saving = true;
  updateControls();
  showMessage(isEditing ? 'Saving changes...' : 'Adding project...');

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, status })
    });

    await readResponse(response);

    resetForm();
    showMessage(isEditing ? 'Project updated.' : 'Project added.');

    await loadProjects({ quiet: true });
    nameInput.focus();
  } catch (error) {
    showMessage(`Could not save project: ${error.message}`);
  } finally {
    saving = false;
    updateControls();
    renderProjects();
  }
});

async function deleteProject(project) {
  if (saving || loading) return;

  if (!window.confirm(`Delete "${project.name}"?`)) return;

  saving = true;
  updateControls();
  renderProjects();
  showMessage('Deleting project...');

  try {
    const response = await fetch(
      `/api/projects/${encodeURIComponent(project.id)}`,
      { method: 'DELETE' }
    );

    await readResponse(response);

    if (editingId === project.id) resetForm();

    showMessage('Project deleted.');
    await loadProjects({ quiet: true });
  } catch (error) {
    showMessage(`Could not delete project: ${error.message}`);
  } finally {
    saving = false;
    updateControls();
    renderProjects();
  }
}

loadProjects();
