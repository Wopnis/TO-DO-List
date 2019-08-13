let storage = localStorage;

function Toodo () {
    this.button = document.getElementById('btn');
    this.input = document.getElementById('task-input');
    this.taskList = document.getElementById('task-list');

    this.getNextKey = function () {
        return `task${storage.length}`;
    };

    this.showTaskItem = function () {
        for(let i = 0; i < storage.length; i++) {
            let data = JSON.parse(storage.getItem(storage.key(i)));
            this.setTaskItemElem(data);
        }
    };

    this.addTaskItem = function (task, status) {
        this.setTaskItemElem({
            task,
            status
        });
        storage.setItem(this.getNextKey(), JSON.stringify({
            task,
            status
        }));
    };

    this.setTaskItemElem = function (data) {
        let li = document.createElement('li');
        li.className = 'list-group-item';
        li.appendChild(new Task(data.task));
        li.appendChild(new ButtonGroup());

        if(data.status === 'new') {
            li.style.background = '#fff';
        } else if (data.status === 'in progress') {
            li.style.background = '#ffc107';
        } else if (data.status === 'success') {
            li.style.background = '#28a745';
        }

        this.taskList.append(li);
    };

    this.initEvents = function() {
        this.button.addEventListener('click', () => {
            let val = this.input.value;
            if(!val) {
                return false;
            } else {
                this.addTaskItem(val, 'new');
            }

        });
    };

    this.showTaskItem();

    this.initEvents();
}

let toodo = new Toodo();


function Button(className, text) {
    this.className = className || '';
    this.text = text || '';

    //Создает новый DOM эл-т, в данном случае button
    //Но не добавляет !!!
    this.$elem = document.createElement('button');

    //Настройка эл-та : классы, текст
    this.$elem.classList = 'btn';
    this.$elem.classList.add(this.className);
    this.$elem.innerText = this.text;

    //Добавляю слушетель события click
    this.$elem.addEventListener('click', function () {

        if(this.classList.contains('btn-danger')) {
            let parent = this.closest('.list-group-item');
            let value = parent.getElementsByClassName('task')[0].innerHTML;
            let taskElem;

            parent.remove();

            for(let i = 0; i < storage.length; i++) {
                taskElem = storage.getItem(storage.key(i)) === value ? storage.key(i) : null;
            }
            storage.removeItem(storage.key(taskElem));
        } else if (this.classList.contains('btn-warning')) {
            let parent = this.closest('.list-group-item');
            let value = parent.getElementsByClassName('task')[0].innerHTML;
            let taskElem;


            for(let i = 0; i < storage.length; i++) {
                taskElem = storage.getItem(storage.key(i)) === value ? storage.key(i) : null;
            }

            storage.setItem(storage.key(taskElem), JSON.stringify({
                task: value,
                status: 'in progress'
            }));

            parent.style.background = '#ffc107';
        } else if (this.classList.contains('btn-success')) {
            let parent = this.closest('.list-group-item');

            let value = parent.getElementsByClassName('task')[0].innerHTML;
            let taskElem;


            for(let i = 0; i < storage.length; i++) {
                taskElem = storage.getItem(storage.key(i)) === value ? storage.key(i) : null;
            }

            storage.setItem(storage.key(taskElem), JSON.stringify({
                task: value,
                status: 'success'
            }));

            parent.style.background = '#28a745';
        }
    });

    return this.$elem;
}

function ButtonGroup() {
    this.$elem = document.createElement('div');
    this.$elem.classList.add('btn-group');
    this.$elem.setAttribute('role', 'group');
    this.$elem.setAttribute('aria-label', 'Basic example');
    this.$elem.appendChild(new Button('btn-success', 'Success'));
    this.$elem.appendChild(new Button('btn-warning', 'In progress'));
    this.$elem.appendChild(new Button('btn-danger', 'Remove'));

    return this.$elem;
}

function Task(text) {
    this.text = text || '';
    this.$elem = document.createElement('div');
    this.$elem.classList = 'task';
    this.$elem.classList.add('mb-4');
    this.$elem.innerText = this.text;

    return this.$elem;
}


