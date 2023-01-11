document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const form = event.target;
  
    const title = form.querySelector('input');
    const description = form.querySelector('textarea');
  
    const h1 = document.createElement('h1');
    const p = document.createElement('p');

    h1.innerHTML = title.value;
    p.innerHTML = description.value;
    
    const li = document.createElement('li');
    li.appendChild(h1);
    li.appendChild(p);
    li.classList.add("task")
    li.addEventListener('click', () =>{
        li.classList.toggle('selected')
    });
  
    const ul = document.querySelector('#to_do');
    ul.appendChild(li);

    const data = {title: title.value , description: description.value, isInProgress: false,
    completed: false};

    fetch('http://127.0.0.1:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => li.setAttribute("data-id", data.id)); 
    
    form.reset()

});

document.querySelector('.move_in_progress').addEventListener('click', () =>{
    const item = document.querySelector('#to_do .selected');
    item.classList.toggle('selected')
    const ul = document.querySelector('#in_progress');
    ul.appendChild(item)

    const data = {title: item.querySelector('h1').innerHTML, 
                description: item.querySelector('p').innerHTML, 
                isInProgress:true, completed:false, id: item.getAttribute("data-id")};

    fetch('http://127.0.0.1:3000/tasks/'+ item.getAttribute("data-id"), {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json());
});

document.querySelector('.move_to_done').addEventListener('click', () =>{
    const item = document.querySelector('#in_progress .selected');
    item.classList.toggle('selected');
    item.classList.replace('task', 'done');
    const ul = document.querySelector('#done');
    ul.appendChild(item);

    const data = {title: item.querySelector('h1').innerHTML, 
    description: item.querySelector('p').innerHTML, 
    isInProgress:false, completed:true, id: item.getAttribute("data-id")};
    
    fetch('http://127.0.0.1:3000/tasks/' + item.getAttribute("data-id"),{
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
});

fetch('http://127.0.0.1:3000/tasks')
    .then(response => response.json())
    .then(data => data.forEach(task => {
        const {id, title, description, isInProgress, completed} = task;
    
        const h1 = document.createElement('h1');
        const p = document.createElement('p');

        h1.innerHTML = title;
        p.innerHTML = description;
        
        const li = document.createElement('li');
        li.appendChild(h1);
        li.appendChild(p);
        li.addEventListener('click', () =>{
            li.classList.toggle('selected')
        });

        li.setAttribute("data-id", id)
        li.setAttribute("data-isInProgress", isInProgress)
        li.setAttribute("data-completed", completed)

        if (isInProgress){
            li.classList.add("task")
            document.querySelector('#in_progress').appendChild(li)
        }
        else if(completed){
            li.classList.add("done")
            document.querySelector('#done').appendChild(li)
        }
        else {
            li.classList.add("task")
            document.querySelector('#to_do').appendChild(li)
        }
    })
);
