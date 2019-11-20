const Application = {
    save () {
        const object = {
            columns: {
                idCounter: Column.idCounter,
                items: []
            },
            notes: {
                idCounter: Note.IdCounter,
                items: []
            }
        }

        document.querySelectorAll('.column').forEach(columnElement => {
            const column = {
                title: columnElement.querySelector('.column-header').textContent,
                id: parseInt(columnElement.getAttribute('data-column-id')),
                noteIds: []
            }
            columnElement.querySelectorAll('.note').forEach(noteElement => {
                column.noteIds.push(parseInt(noteElement.getAttribute('data-note-id')))
            })

            object.columns.items.push(column);
        })

        document.querySelectorAll('.note').forEach(noteElement => {
            const note = {
                id: parseInt(noteElement.getAttribute('data-note-id')),
                content: noteElement.textContent
            }

            object.notes.items.push(note);
        })

        const json = JSON.stringify(object);

        localStorage.setItem('trello', json);

    },

    load () {
        if(!localStorage.getItem('trello')){
            Application.save();
            return;
        }
        
        const mountPoint = document.querySelector('.columns');
        mountPoint.innerHTML = '';

        const object = JSON.parse(localStorage.getItem('trello'))
        const getNoteById = id => object.notes.items.find(note =>  note.id === id);

        for (const column of object.columns.items) {
            const columnClass = new Column(column.id);
            columnClass.element.querySelector('.column-header').textContent = column.title;
            mountPoint.append(columnClass.element);
        

        for(const noteID of column.noteIds) {
            const { id, content } = getNoteById(noteID);
            const note = new Note(id, content);
            columnClass.element.querySelector('[data-notes]').append(note.element);
        }

        }
    }
}
