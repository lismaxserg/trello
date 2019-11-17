const Column = {
    idCounter: 4,

    process(columnElement) {
        const spanAction_addNote = columnElement.querySelector('[data-action-addNote]');
        spanAction_addNote.addEventListener('click', function (event) {
            const noteElement = Note.create();
            columnElement.querySelector('[data-notes]').append(noteElement);
    
            noteElement.setAttribute('contenteditable', true);
            noteElement.focus();

            
        });
    
        const header = columnElement.querySelector('.column-header');
    
        header.addEventListener('dblclick', function (event) {
            header.setAttribute('contenteditable', true);
            header.focus();
            header.addEventListener('blur', function (event) {
                header.removeAttribute('contenteditable');
                 Application.save();
            });
        });

        columnElement.addEventListener('dragstart', Column.dragstart);
        columnElement.addEventListener('dragend', Column.dragend);

        columnElement.addEventListener('dragenter', Column.dragenter);
        columnElement.addEventListener('dragover', Column.dragover);
        columnElement.addEventListener('dragleave', Column.dragleave);
    
        columnElement.addEventListener('drop', Column.drop);
    },

    create(id = null){
        const columnElement = document.createElement('div');
        columnElement.classList.add('column');
        columnElement.setAttribute('draggable', true);
        if(id){
            columnElement.setAttribute('data-column-id', id);
        }else{
            columnElement.setAttribute('data-column-id', Column.idCounter);
            Column.idCounter++;
        }
        
        columnElement.innerHTML = `<p class="column-header" contenteditable="true">В плане</p>
        <div data-notes></div>
        <p class="column-footer">
            <span data-action-addNote class="action">+ Добавить карточку</span>
        </p>`;
    
        Column.process(columnElement);

        return columnElement;
    
    },

    dragstart(event){
        Column.dragged = this;
        this.classList.add('dragged');
        event.stopPropagation();

        document.querySelectorAll('.note').forEach(x => x.removeAttribute('draggable'));
    },

    dragend(event){
        Column.dragged.classList.remove('dragged');
        Column.dragged = null;
        document.querySelectorAll('.note').forEach(x => x.setAttribute('draggable', true));

        Application.save();
    },
    
    dragenter(event){
        if(!Column.dragged || this === Column.dragged) {
            return;
        }
        this.classList.add('under');
    },
    
    dragleave(event){
        if(!Column.dragged || this === Column.dragged) {
            return;
        }
        this.classList.remove('under');
    },

    dragover(event){
        event.preventDefault();
        if(!Column.dragged || this === Column.dragged) {
            return;
        }
    },

    drop(event){
        if(Note.dragged){
            return this.querySelector('[data-notes]').append(Note.dragged);
        } else if(Column.dragged) {
           const children =  Array.from(document.querySelector('.columns').children);
           const indexA = children.indexOf(this);
           const indexB = children.indexOf(Column.dragged);
           if(indexA < indexB){
                this.parentElement.insertBefore(Column.dragged, this); 
            } else{
                this.parentElement.insertBefore(Column.dragged, this.nextElementSibling); 
            }
        }
    }
}