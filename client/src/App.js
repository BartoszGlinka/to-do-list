import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  };

  componentDidMount() {
    this.socket = io.connect('http://localhost:8000');
    this.socket.on('addTask', task => this.addTask(task))
    this.socket.on('removeTask', id => this.removeTask(id))
    this.socket.on('updateData', e => this.updateTask(e))
  };
  updateTask(e) {
    this.setState({taskName: e});
  }
  addTask(task) {
    this.setState({tasks: [...this.state.tasks, task]});
  }

  removeTask(id, isLocal) {
    this.setState({ tasks: this.state.tasks.filter(task => task.id !== id)});
    if (isLocal) 
      this.socket.emit('removeTask', id);
  };

  submitForm(e) {
    const { taskName } = this.state;
    e.preventDefault();
    const newTask = {id : uuidv4(), name : taskName  }
    this.addTask(newTask);
    this.socket.emit('addTask', newTask);
  };
  
  render(task) {
    const { tasks, taskName } = this.state;
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li class="task" key={task.id}>
                  {task.name}
                  <button class="btn btn--red" onClick={() => this.removeTask(task.id, true)}>Remove</button>
              </li>
            ))}
          </ul>
    
          <form id="add-task-form">
            <input className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={(e) => this.updateTask(e.target.value)}/>
            <button className="btn" type="submit" onClick={e => this.submitForm(e) }>Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;