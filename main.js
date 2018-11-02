
var allTasks = [
    // {
    //     id : 0,
    //     taskname : 'task 1',
    //     tasktext : 'text for task 1',
    //     taskstatus : 'backlog_list'
    // }
];
var notShow = false;

function addCard(){
    validateModal();
    if (notShow) {
        return false;
    } else {
        var createdCard = {};
        if (allTasks.length == 0) {
            createdCard['id'] = 0;
        } else {
            createdCard['id'] = allTasks[(allTasks.length - 1)]['id'] + 1;
        };
        createdCard['taskname'] = document.getElementById('input_name').value;
        createdCard['tasktext'] = document.getElementById('input_text').value;
        createdCard['taskstatus'] = 'backlog_list';
        allTasks.push(createdCard);
        document.getElementsByClassName('modal_overlay')[0].remove();
        showCards();
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

function showModal(){
    var addModal = document.createElement('div');
    addModal.setAttribute('class', 'modal_overlay');
    addModal.innerHTML = '<div class="modal_body"><div class="modal_title">Новая задача</div><div class="modal_name"><input id="input_name" type="text" placeholder="Название задачи"></div><div class="modal_text"><textarea id="input_text" placeholder="Текст задачи"></textarea></div><div class="modal_action"><button id="input_cancel">Отменить</button><button id="input_ok">Сохранить</button></div></div>';
    document.body.appendChild(addModal);
};

function showCards() {
    for (var i = 0; i < document.getElementsByClassName('board_container')[0].children.length; i++) {
        document.getElementsByClassName('board_container')[0].children[i].innerHTML = '';
    };
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i]['taskname'].length > 0) {
            var newCard = document.createElement('div');
            newCard.setAttribute('id', allTasks[i]['id']);
            newCard.setAttribute('class', 'card');
            newCard.innerHTML = '<div class="card_title"></div><div class="card_text"></div><div class="card_action"><button class="del_this_task">Удалить</button><button class="move_this_task">Взять в работу</button></div>'
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
document.getElementById('add_task').addEventListener('click', showModal);

function changeCardStatus(card, status){
    var cardStatusBtn = ['Взять в работу', 'Завершить', 'Вернуть в работу'];
    var taskStatus = ['backlog_list', 'work_list', 'done_list'];
    var cardId = +card.id;
    allTasks[cardId]['taskstatus'] = taskStatus[status];
    card.getElementsByClassName('move_this_task')[0].innerText = cardStatusBtn[status];
    console.log(allTasks);
};

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
    };
    document.addEventListener('mousemove', cardMove);
    document.addEventListener('mouseup', endMove);
    function endMove(){
        document.removeEventListener('mousemove', cardMove);
        document.removeEventListener('mouseup', endMove);
        startColumn.classList.remove('start_card_move');
        changeCardStatus(moveCard, cardStatus);
        document.getElementsByClassName('has_moved_card')[0].appendChild(moveCard);
        document.getElementsByClassName('has_moved_card')[0].classList.remove('has_moved_card');
    }
});

//TO DD - move card position and change his status from click on action buttons