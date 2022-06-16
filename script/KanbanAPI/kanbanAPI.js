export default class KanbanAPI{
    // First function 
    static getItems(columnID){
        const column = handleReadData().find(column => column.id == columnID);

        if(!column){
            return [];
        }
        return column.items;
    }
    // This function will execute when we try to add the new item (CONTENT) in the current column      
    static insertItem(columnID, content){
        const data = handleReadData();
        const column = data.find(column => column.id == columnID);
        const item = {
            id:Math.floor(Math.random() * 100000),
            content
        }
        if(!column){
            throw new Error("Sorry, this column was not existed !!!!");
        }
        column.items.push(item);

        handleSaveData(data);

        return item;
    }
    // This function will execute when we drag or drop the item to the another column
    /**
     * @param itemID: the item that we want to drag or drop 
     * @param newProps: columnID: the column that we want to move, position 
     */
    static updateItem(itemID, newProps){
        // Read the data 
        const data = handleReadData();
        const [item, currentColumn] = (() => {
            for(const column of data){ 
                const item = column.items.find(item => item.id == itemID);
                if(item){
                    return [item, column];
                }
            }
        })() //  Using the array destructuring. 
        if(!item){
            throw new Error("Sorry, item was not found !!!!");
        }
        item.content = newProps.content === undefined ? item.content : newProps.content;
        // Update the column and position 
        if(
            newProps.columnID !== undefined
            && newProps.position !== undefined
        ){
            const targetColumn = data.find(column => column.id === newProps.columnID);
            if (!targetColumn){
                throw new Error("Sorry, the target column was not found !!!!");
            }
            // Delete the item in the current column
            currentColumn.items.splice(currentColumn.items.indexOf(item), 1);
            // Move item into the new column and its current position after drag or drop 
            targetColumn.items.splice(newProps.position, 0, item);
        }
        handleSaveData(data);
    }
    // Remove the item in the column
    static deleteItem(itemID){
        const data = handleReadData();
        for(const column of data){
            const item = column.items.find((item) => item.id === itemID);

            if(item){
                column.items.splice(column.items.indexOf(item), 1);
            }
        }
        handleSaveData(data);
    }
}
// Convert JSON to Javascript data
// Data is the column that we want to read
function handleReadData(){
    const json = localStorage.getItem("kanbanData");

    if(!json){
        return [
            {
                id: 1,
                items: []
            },
            {
                id: 2,
                items: []
            },
            {
                id: 3,
                items: []
            },
        ]
    }

    return JSON.parse(json);
}
function handleSaveData(data){
    localStorage.setItem("kanbanData", JSON.stringify(data))
}


