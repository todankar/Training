function addItem(textValue,saveStyle = false){

    let item = textValue || document.getElementById("newItem").value;
    

    if(item){
        //console.log(item);
        var node = document.createElement("LI");               
        var textnode = document.createTextNode(item);       
        node.appendChild(textnode);   
        node.setAttribute("onclick","strikeItem(this)");
        node.setAttribute("ondblclick","removeItem(this)");  
        node.classList.add("item");    
        if(saveStyle){
            node.classList.add("itemDone");
        }                    
        document.getElementsByTagName("ul")[0].appendChild(node);    
        if( document.getElementById("saveUpdate").style.display=="none"){
            document.getElementById("saveUpdate").style.display="block";
        } 
        if( document.getElementById("saveItem").style.display=="none"){
            document.getElementById("saveItem").style.display="block";
        }    
    }

    
}

function init(el){

    let profile = new XMLHttpRequest();
    profile.open("POST","http://www.aztechz.com/to-do-api/get_list.php", false);
    profile.setRequestHeader("Content-Type","application/json");
    let parameter = {"user_id":el.value};
    profile.send(JSON.stringify(parameter));
    let profileData = JSON.parse(profile.responseText);


    let savedList = localStorage.list ? localStorage.list : "";
    let foundItem = localStorage[(new Date()).toLocaleDateString()] ||  "";
    let itemStatus = foundItem ? JSON.parse(foundItem) : {};
    if(savedList.length>0){
        let values = savedList.length>0 ? savedList.split(",") : savedList.list ;
        let items = Object.values(itemStatus);
        values.forEach(v => {
            let saveStyle = (Object.values(items).find(function(b){
                return b[v];
            }));
            addItem(v,saveStyle);
        },addItem,items);
    }
    loadBtns();

}

function loadBtns(){
    if(document.getElementsByTagName("li").length <= 0){
        document.getElementById("saveUpdate").style.display="none";
        document.getElementById("saveItem").style.display="none";
    }
    else{
        document.getElementById("saveUpdate").style.display="block";
        if(!localStorage.list){
            document.getElementById("saveItem").style.display="block"; 
        }
        else{
            document.getElementById("saveItem").style.display="none";   
        }
    }
}

function saveItems(saveBtn){
    if(!localStorage.list){
        let list=[];
        let items = document.getElementsByTagName("li");
        let itemValues = Array.from(items);
        itemValues.forEach(element => {
            list.push(element.innerText);
        },list);
    
    localStorage.setItem("list",list);
    saveBtn.style.display="none";
    }
}

function strikeItem(el){
    if(el.classList.length>0){
        if(el.classList.value.indexOf("itemDone")<0){
            el.classList.add("itemDone");
        }
        else{
            el.classList.remove("itemDone");
        }
    }
}

function removeItem(el){
    if(el.classList.value.indexOf("itemDone")>0){
        el.remove();
    }
}

function saveList(){
    let doneItems = [];
    let allItems = document.getElementsByTagName("li");
    let allItemsArray = Array.from(allItems);
    allItemsArray.forEach(element => {
        let a={};
        a[element.innerText] = element.classList.value.indexOf("itemDone")>=0 ? true : false;
        doneItems.push(a); 
        
    },doneItems);
    console.log( typeof doneItems);
    let dateValue = (new Date()).toLocaleDateString();
    localStorage.setItem(dateValue,JSON.stringify(doneItems));
}