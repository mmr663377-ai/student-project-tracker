
const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#name');
const statusInput = document.querySelector('#status');
const projectList = document.querySelector('#project-list');
const emptyState = document.querySelector('#empty-state');

const projects = [];

function renderProjects() {
  projectList.replaceChildren();

  emptyState.hidden = projects.length > 0;

  projects.forEach(project => {
    const item = document.createElement('li');
    const name = document.createElement('strong');
    const status = document.createElement('span');

    name.textContent = project.name;
    status.textContent = ` — ${project.status}`;

    item.append(name, status);
    projectList.appendChild(item);
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const status = statusInput.value;

  if (!name) {
    nameInput.focus();
    return;
  }

  const project = {
    id: crypto.randomUUID(),
    name: name,
    status: status
  };

  projects.push(project);

  renderProjects();

  form.reset();
  nameInput.focus();
});

