class Column {
    constructor(id = null){
        const element = this.element = document.createElement('div');
        element.classList.add('column');
        element.setAttribute('draggable', true);
        if(id){
            element.setAttribute('data-column-id', id);
        }else{
            element.setAttribute('data-column-id', Column.idCounter);
            Column.idCounter++;
        }
        
        element.innerHTML = `<p class="column-header" contenteditable="true">В плане</p>
        <div data-notes></div>
        <p class="column-footer">
            <span data-action-addNote class="action">+ Добавить карточку</span>
        </p>`;

        const spanAction_addNote = element.querySelector('[data-action-addNote]');
        spanAction_addNote.addEventListener('click', function (event) {
            const noteElement = Note.create();
            element.querySelector('[data-notes]').append(noteElement);
    
            noteElement.setAttribute('contenteditable', true);
            noteElement.focus();

            
        });
    
        const header = element.querySelector('.column-header');
    
        header.addEventListener('dblclick', function (event) {
            header.setAttribute('contenteditable', true);
            header.focus();
            header.addEventListener('blur', function (event) {
                header.removeAttribute('contenteditable');
                 Application.save();
            });
        });

        element.addEventListener('dragstart', this.dragstart.bind(this));
        element.addEventListener('dragend', this.dragend.bind(this));

        element.addEventListener('dragenter', this.dragenter.bind(this));
        element.addEventListener('dragover', this.dragover.bind(this));
        element.addEventListener('dragleave', this.dragleave.bind(this));
    
        element.addEventListener('drop', this.drop.bind(this));
    
    }

    dragstart(event){
        Column.dragged = this.element;
        this.element.classList.add('dragged');
        event.stopPropagation();

        document.querySelectorAll('.note').forEach(x => x.removeAttribute('draggable'));
    }

    dragend(event){
        Column.dragged.classList.remove('dragged');
        Column.dragged = null;
        document.querySelectorAll('.note').forEach(x => x.setAttribute('draggable', true));

        Application.save();
    }
    
    dragenter(event){
        if(!Column.dragged || this.element === Column.dragged) {
            return;
        }
        this.element.classList.add('under');
    }
    
    dragleave(event){
        if(!Column.dragged || this.element === Column.dragged) {
            return;
        }
        this.element.classList.remove('under');
    }

    dragover(event){
        event.preventDefault();
        if(!Column.dragged || this.element === Column.dragged) {
            return;
        }
    }

    drop(event){
        if(Note.dragged){
            return this.element.querySelector('[data-notes]').append(Note.dragged);
        } else if(Column.dragged) {
           const children =  Array.from(document.querySelector('.columns').children);
           const indexA = children.indexOf(this.element);
           const indexB = children.indexOf(Column.dragged);
           if(indexA < indexB){
                this.element.parentElement.insertBefore(Column.dragged, this.element); 
            } else{
                this.element.parentElement.insertBefore(Column.dragged, this.element.nextElementSibling); 
            }
        }
    }

}

Column.idCounter = 4;
Column.dragged = null;  