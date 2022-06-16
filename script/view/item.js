import KanbanAPI from "../KanbanAPI/kanbanAPI.js";
import Kanban from "./kanban.js";
import Column from "./column.js";
import Dropzone from "./dropzone.js";

export default class Item{
    constructor(id, content){
        const bottomZone = Dropzone.createDropZone();
        this.elements = {};
        this.elements.root = Item.createRoot();
        this.elements.input = this.elements.root.querySelector(".kanban__item-input");
        this.elements.root.dataset.id = id;
        this.elements.input.textContent = content;
        // Update the content 
        this.content = content;
        this.elements.root.appendChild(bottomZone);
        //  Update the content and hold its value regardless of RELOAD page
        const onBlur = () => {
            const newContent = this.elements.input.textContent.trim();
            if (newContent == this.content){
                return;
            }
            this.content = newContent;
            KanbanAPI.updateItem(id, {
                content: this.content
            })
        }
        // The data will save when blur the content
        this.elements.input.addEventListener("blur", onBlur);
        this.elements.root.addEventListener("dblclick", () => {
            const check = confirm("Are you sure you want to remove this item ?");
            if(check){
                KanbanAPI.deleteItem(id);

                this.elements.input.removeEventListener("blur", onBlur);
                this.elements.root.parentElement.removeChild(this.elements.root);
            }
        });
        this.elements.root.addEventListener("dragstart", ev => {
            ev.dataTransfer.setData("text/plain", id);
        })
        this.elements.input.addEventListener("drop", ev => {
            ev.preventDefault();
        })
    }
    static createRoot(){
        // Create the range 
        const range = document.createRange();
        // Select the node
        range.selectNode(document.body);
        return range.createContextualFragment(
            `
                <div class="kanban__item" draggable = 'true'>
                    <div class="kanban__item-input" contenteditable></div>
                </div> 
            `
        ).children[0];
    }
}

