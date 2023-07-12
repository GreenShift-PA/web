import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/app/models/Todo';
@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos:Todo[]=[];
  todos_done:Todo[]=[];
  inputTodo:string="";
  constructor(){

  }

  ngOnInit(): void {
    this.todos = [
      {
        content: 'First short task',
        completed: false
      },
      {
        content: 'Second medium-length task',
        completed: false
      },
      {
        content: 'Third long task with more content and details',
        completed: false
      },
      {
        content: 'Fourth task',
        completed: false
      },
    ];
  
    this.todos_done = [
      {
        content: 'First completed task',
        completed: true
      },
      {
        content: 'Second completed task',
        completed: true
      },
      {
        content: 'Third completed task',
        completed: true
      },
    ];
  }

  toggleDone_todos(id: number) {
    setTimeout(()=>{
 
    const todo = this.todos[id];
    todo.completed = !todo.completed;
  
    if (todo.completed) {
      this.todos_done.push(todo);
      this.todos = this.todos.filter((_, i) => i !== id);
    }
    
},300)
  }
  
  toggleDone_todos_done(id: number) {
setTimeout(()=>{
 
  const todo = this.todos_done[id];
  todo.completed = !todo.completed;

  if (!todo.completed) {
    this.todos.push(todo);
    this.todos_done = this.todos_done.filter((_, i) => i !== id);
  }
},300)

   
  }
  
  deleteTodo(id:number){
    this.todos= this.todos?.filter((v,i)=> i!==id);

  }

  addTodo(name:string){
    if(name.trim().length>0)
    this.todos?.push({
      content:name,
      completed:false
    })
    this.inputTodo="";
  }
}