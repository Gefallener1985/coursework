
var users = [];
var allTasks = [
    // {
    //     taskname : 'task 1',
    //     tasktext : 'text for task 1',
    //     taskuser : 'user_1',
    //     taskstatus : 'backlog_list'
    // }
];
var notShow = true;

function addCard(){
    var createdCard = {};
    createdCard['taskname'] = document.getElementById('input_name').value;
    createdCard['tasktext'] = document.getElementById('input_text').value;
    createdCard['taskuser'] = 'user_1';
    createdCard['taskstatus'] = 'backlog_list';
    allTasks.push(createdCard);
    showCards();
};

function showModal(){
    var addModal = document.createElement('div');
    addModal.setAttribute('class', 'modal_overlay');
    addModal.innerHTML = '<div class="modal_body"><div class="modal_title">Новая задача</div><div class="modal_name"><input id="input_name" type="text" placeholder="Название задачи"></div><div class="modal_text"><textarea id="input_text" placeholder="Текст задачи"></textarea></div><div class="modal_user"></div><div class="modal_action"><button id="input_cancel">Отменить</button><button id="input_ok">Сохранить</button></div></div>';
    document.body.appendChild(addModal);
};

function showCards() {
    console.log(allTasks);
    for (var i = 0; i < document.getElementsByClassName('board_container')[0].children.length; i++) {
        document.getElementsByClassName('board_container')[0].children[i].innerHTML = '';
    };
    for (var i = 0; i < allTasks.length; i++) {
        var newCard = document.createElement('div');
        newCard.setAttribute('class', 'card');
        newCard.innerHTML = '<div class="card_title"></div><div class="card_text"></div><div class="card_user"></div><div class="card_action"></div>'
            //console.log(key + ' : ' + allTasks[i][key])
        newCard.getElementsByClassName('card_title')[0].innerText = allTasks[i]['taskname'];
        newCard.getElementsByClassName('card_text')[0].innerText = allTasks[i]['tasktext'];
        newCard.getElementsByClassName('card_user')[0].innerText = allTasks[i]['taskuser'];
        document.getElementsByClassName(allTasks[i]['taskstatus'])[0].appendChild(newCard);
    };
};




document.addEventListener('click', function(e){
    if (e.target.id == 'input_cancel') {
        document.getElementsByClassName('modal_overlay')[0].remove();
    } else if (e.target.id == 'input_ok') {
        addCard();
        document.getElementsByClassName('modal_overlay')[0].remove();
    };
});
document.getElementById('add_task').addEventListener('click', showModal);