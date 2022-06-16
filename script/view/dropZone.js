import KanbanAPI from "../KanbanAPI/kanbanAPI.js";

export default class DropZone{
    static createDropZone(){
        // Create the range 
        const range = document.createRange();
        range.selectNode(document.body);
        const dropZone = range.createContextualFragment(`
            <div class = "kanban__dropZone"></div>
        `).children[0];
        dropZone.addEventListener("dragover", ev => {
            ev.preventDefault();
            dropZone.classList.add("kanban__dropZone--active");
        })
        dropZone.addEventListener("dragleave", ev => {
            dropZone.classList.remove("kanban__dropZone--active");
        })
        dropZone.addEventListener("drop", ev => {
            ev.preventDefault();
            dropZone.classList.remove("kanban__dropZone--active");

            const columnElement = dropZone.closest(".kanban__column");
            const columnID = Number(columnElement.dataset.id);
            const dropZoneInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropZone"));
            const droppedIndex = dropZoneInColumn.indexOf(dropZone);

            const itemId = Number(ev.dataTransfer.getData("text/plain"));
            const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);
            const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone;

            console.log(insertAfter);
            if(droppedItemElement.contains(dropZone)){
                return;
            }
            insertAfter.after(droppedItemElement);

            KanbanAPI.updateItem(itemId, {
                columnID,
                position: droppedIndex
            })
        })
        return dropZone;
    }       
}

