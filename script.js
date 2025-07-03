
    /* ---------- storage helpers ---------- */
    const STORAGE_KEY = 'dp_tasks';
    const loadTasks  = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const saveTasks  = (tasks) => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

    /* ---------- global refs ---------- */
    const listEl = document.getElementById('taskList');

    /* ---------- render ---------- */
    function render() {
      const tasks = loadTasks();
      listEl.innerHTML = '';

      tasks.forEach((task, index)=> {
        const card = document.createElement('div');
        card.className =
          `rounded-2xl border border-gray-200 bg-white p-6
           shadow-[0_0_16px_rgba(56,189,248,.15),0_0_16px_rgba(251,191,36,.15)]`;

        /* ------- title row ------- */
        const row = document.createElement('div');
        row.className = 'flex items-start gap-3';

        const title = document.createElement('h2');
        title.textContent = `${index + 1}. ${task.title}`;
        title.className = `flex-1 font-indie text-2xl break-words transition-all
                           ${task.isDone
                              ? 'line-through decoration-red-500 opacity-80'
                              : 'text-gray-900'}`;

        /* Done / Delete / Notes buttons */
        const doneBtn = document.createElement('button');
        doneBtn.textContent = task.isDone ? 'Undo' : '✓';
        doneBtn.title = 'Mark done';
        doneBtn.className =
          `px-2 py-1 rounded-md text-sm ${task.isDone ? 'bg-amber-500' : 'bg-emerald-500'}
           text-white hover:brightness-110`;
        doneBtn.onclick = () => { task.isDone = !task.isDone; update(task); };

        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑';
        delBtn.title = 'Delete task';
        delBtn.className =
          'px-2 py-1 rounded-md text-sm bg-red-500 text-white hover:bg-red-600';
        delBtn.onclick = () => { remove(task.id); };

        const notesBtn = document.createElement('button');
        notesBtn.textContent = task.notes ? 'Notes 📝' : 'Add Notes';
        notesBtn.title = 'Toggle notes';
        notesBtn.className =
          'px-2 py-1 rounded-md text-sm bg-sky-500 text-white hover:bg-sky-400';
        notesBtn.onclick = () => toggleNotes(card, task);

        row.append(title, doneBtn, delBtn, notesBtn);
        card.appendChild(row);

        /* ------- notes panel (hidden by default) ------- */
        if (task.showNotes) card.appendChild(buildNotesArea(task));

        listEl.appendChild(card);
      });
    }

    /* ---------- helpers ---------- */
    function buildNotesArea(task) {
      const wrapper = document.createElement('div');
      wrapper.className = 'mt-4';
      // textarea
      const ta = document.createElement('textarea');
      ta.value = task.notes || '';
      ta.placeholder = 'Write your plan here...';
      ta.rows = 4;
      ta.className =
        `w-full font-patrick text-lg leading-relaxed text-gray-800
         bg-yellow-50 border border-yellow-200 rounded-lg p-4 resize-y
         focus:outline-none focus:ring-2 focus:ring-sky-400`;
      ta.oninput = e => { task.notes = e.target.value; update(task, false); };

      wrapper.appendChild(ta);
      return wrapper;
    }

    function toggleNotes(card, task) {
      task.showNotes = !task.showNotes;
      update(task, false);  // save state but don't close panel
      render();
      if (task.showNotes) {
        // focus textarea after render
        setTimeout(() => card.querySelector('textarea')?.focus(), 0);
      }
    }

    function update(task, rerender = true) {
      const tasks = loadTasks().map(t => (t.id === task.id ? task : t));
      saveTasks(tasks);
      if (rerender) render();
    }

    function remove(id) {
      const tasks = loadTasks().filter(t => t.id !== id);
      saveTasks(tasks);
      render();
    }

    /* ---------- add form ---------- */
    document.getElementById('addForm').addEventListener('submit', e => {
      e.preventDefault();
      const titleEl = document.getElementById('newTitle');
      const title = titleEl.value.trim();
      if (!title) return;
      const tasks = loadTasks();
      tasks.push({ id: Date.now(), title, notes: '', isDone: false, showNotes: true });
      saveTasks(tasks);
      titleEl.value = '';
      render();
      // autofocus new notes textarea
      setTimeout(() => document.querySelector('textarea')?.focus(), 0);
    });

    /* ---------- initial paint ---------- */
    render();
  