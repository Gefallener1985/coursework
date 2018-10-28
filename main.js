
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