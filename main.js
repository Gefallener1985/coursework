
var allTasks = [
    // {
    //     id : 0,
    //     taskname : 'task 1',
    //     tasktext : 'text for task 1',
    //     taskstatus : 'backlog_list'
    // }
];
var notShow = false;
var taskStatusBtn = ['Взять в работу', 'Завершить', 'Вернуть в работу'];
var taskStatus = ['backlog_list', 'work_list', 'done_list'];

class Card {
    constructor(id, title, text, status){
        this.id = id;
        this.taskname = title;
        this.tasktext = text;
        this.taskstatus = status;
    }
    createNewCard(){
        allTasks.push(this);
    }
    changeStatus(status, ifclicked) {
        if (ifclicked) {
            return taskStatus.indexOf(status);
        } else {
            this.taskstatus = taskStatus[status];
            document.getElementById(this.id).getElementsByClassName('move_this_task')[0].innerText = taskStatusBtn[status];
        }
    }
}

function deleteTask(id){
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i] != null && allTasks[i]['id'] == id) {
            allTasks[i] = null;
        }
    };
    document.getElementById(id).remove();
    saveToLocal();
}

function addCard(){
    validateModal();
    if (notShow) {
        return false;
    } else {
        var newId;
        if (allTasks.length == 0) {
            newId = 0
        } else {
            newId = allTasks[(allTasks.length - 1)]['id'] + 1;
        };
        var newCard = new Card(newId, document.getElementById('input_name').value, document.getElementById('input_text').value, 'backlog_list');
        newCard.createNewCard();
        document.getElementsByClassName('modal_overlay')[0].remove();
        showCards();
        saveToLocal()
    };
};

function validateModal(){
    var inputs = [
        document.getElementById('input_name'),
        document.getElementById('input_text')
    ];
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value.length == 0) {
            inputs[i].parentElement.classList.add('has_error');
            notShow = true;
            return false;
        } else {
            notShow = false;
            inputs[i].parentElement.classList.remove('has_error');
        };
    };
};

class Modal {
    constructor() {
        this.tagname = 'div';
        this.class = 'modal_overlay';
        this.html = '<div class="modal_body"><div class="modal_title">Новая задача</div><div class="modal_name"><input id="input_name" type="text" placeholder="Название задачи"></div><div class="modal_text"><textarea id="input_text" placeholder="Текст задачи"></textarea></div><div class="modal_action"><button id="input_cancel">Отменить</button><button id="input_ok">Сохранить</button></div></div>';
    };
    showNewModal(){
        var addModal = document.createElement(this.tagname);
        addModal.setAttribute('class', this.class);
        addModal.innerHTML = this.html;
        document.body.appendChild(addModal);
    }
}
document.getElementById('add_task').addEventListener('click', function(){
    var newModal = new Modal;
    newModal.showNewModal();
});

function showCards() {
    for (var i = 0; i < document.getElementsByClassName('board_container')[0].children.length; i++) {
        document.getElementsByClassName('board_container')[0].children[i].innerHTML = '';
    };
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i] != null && allTasks[i]['taskname'].length > 0) {
            var newCard = document.createElement('div');
            newCard.setAttribute('id', allTasks[i]['id']);
            newCard.setAttribute('class', 'card');
            var statusIndex = taskStatus.indexOf(allTasks[i]['taskstatus']);
            newCard.innerHTML = '<div class="card_title"></div><div class="card_text"></div><div class="card_action"><button class="del_this_task">Удалить</button><button class="move_this_task">' + taskStatusBtn[statusIndex] + '</button></div>'
            newCard.getElementsByClassName('card_title')[0].innerText = allTasks[i]['taskname'];
            newCard.getElementsByClassName('card_text')[0].innerText = allTasks[i]['tasktext'];
            document.getElementsByClassName(allTasks[i]['taskstatus'])[0].appendChild(newCard);
        }
    };
};

document.addEventListener('click', function(e){
    if (e.target.id == 'input_cancel') {
        document.getElementsByClassName('modal_overlay')[0].remove();
    } else if (e.target.id == 'input_ok') {
        addCard();
    };
});

document.addEventListener('mousedown', function(e){
    var moveCard;
    if (e.target.classList == 'card') {
        moveCard = e.target;
    } else if (e.target.parentElement.classList == 'card') {
        moveCard = e.target.parentElement;
    } else {
        return false;
    };
    document.body.classList.add('if_moved');
    var boardCoord = [100];
    var bodyWidth = parseInt(getComputedStyle(document.body).width);
    boardCoord.push(100 + ((bodyWidth - 100) / 3)); 
    boardCoord.push(100 + (((bodyWidth - 100) / 3) * 2));
    boardCoord.push(bodyWidth);
    var startColumn;
    for (var i = 0; i < boardCoord.length; i++) {
        if (e.clientX > boardCoord[i] && e.clientX < boardCoord[i + 1]) {
            startColumn = document.getElementsByClassName('board_container')[0].children[i];
        }
    }
    startColumn.classList.add('start_card_move');
    var cardStatus;
    function cardMove(move){
        if (document.getElementsByClassName('has_moved_card').length > 0) {
            document.getElementsByClassName('has_moved_card')[0].classList.remove('has_moved_card');
        }
        for (var i = 0; i < boardCoord.length; i++) {
            if (move.clientX > boardCoord[i] && move.clientX < boardCoord[i + 1]) {
                if (document.getElementsByClassName('board_container')[0].children[i].classList.contains('has_moved_card')) {
                    return false;
                }
                cardStatus = i;
                document.getElementsByClassName('board_container')[0].children[i].classList.add('has_moved_card');
            };
        }
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else { // old IE
            document.selection.empty();
        }
    };
    document.addEventListener('mousemove', cardMove);
    document.addEventListener('mouseup', endMove);
    function endMove(){
        document.removeEventListener('mousemove', cardMove);
        document.removeEventListener('mouseup', endMove);
        startColumn.classList.remove('start_card_move');
        var cardNumber;
        for (var i = 0; i < allTasks.length; i++) {
            if (allTasks[i] != null && allTasks[i]['id'] == moveCard.id) {
                cardNumber = i;
            }
        };
        allTasks[cardNumber].changeStatus(cardStatus);
        document.getElementsByClassName('has_moved_card')[0].appendChild(moveCard);
        document.getElementsByClassName('has_moved_card')[0].classList.remove('has_moved_card');
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else { // old IE
            document.selection.empty();
        }
        saveToLocal();
    }
});

document.addEventListener('click', function(e){
    var currentNode, cardId, cardNumber;
    if (e.target.parentElement.classList == 'card_action') {
        currentNode = e.target.parentElement.parentElement;
        cardId = currentNode.id;
        for (var i = 0; i < allTasks.length; i++) {
            if (allTasks[i] != null && allTasks[i]['id'] == cardId) {
                cardNumber = i;
            }
        };
    }
    if (e.target.classList == 'move_this_task') {
        var currentStatIndex = allTasks[cardNumber].changeStatus(allTasks[cardNumber]['taskstatus'], true);
        if (currentStatIndex < 2) {
            document.getElementsByClassName('board_container')[0].children[currentStatIndex + 1].appendChild(currentNode);
            allTasks[cardNumber].changeStatus(currentStatIndex + 1)
        } else {
            document.getElementsByClassName('board_container')[0].children[currentStatIndex - 1].appendChild(currentNode);
            allTasks[cardNumber].changeStatus(currentStatIndex - 1)
        }
    } else if (e.target.classList == 'del_this_task') {
        deleteTask(cardId);
    }
    saveToLocal();
});

function loadTasks(){
    if (localStorage.getItem('savedTasks') && localStorage.getItem('savedTasks').length > 2) {
        allTasks = JSON.parse(localStorage.getItem('savedTasks'));
        showCards();
    } else {
        var ajaxLoadUrl = 'http://localhost:3000/tasks'
        var httpReques = new XMLHttpRequest;
        httpReques.open('GET', ajaxLoadUrl);
        httpReques.send();

        httpReques.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                var responseData = JSON.parse(httpReques.responseText);
                allTasks = [];
                for (var i = 0; i < responseData.length; i++) {
                    var newId;
                    var newTitle = responseData[i]['taskname']
                    var newText = responseData[i]['tasktext'];
                    var newStatus = responseData[i]['taskstatus'];
                    if (allTasks.length == 0) {
                        newId = 0
                    } else {
                        newId = allTasks[(allTasks.length - 1)]['id'] + 1;
                    };
                    var newCard = [];
                    newCard[i] = new Card(newId, newTitle, newText, newStatus);
                    newCard[i].createNewCard();
                }
                showCards();
                saveToLocal();
            }
        }
    };
}
loadTasks();

document.getElementById('del_tasks').addEventListener('click', function(){
    var realyDelete = confirm('Вы действительно хотите удалить все задачи и загрузить дефолтные с сервера?');
    if (realyDelete) {
        allTasks = [];
        localStorage.removeItem('savedTasks');
        location.reload();
    }
});

function saveToLocal(){
    localStorage.setItem('savedTasks', JSON.stringify(allTasks));
}