import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/app/models/Todo';
@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos:Todo[] | undefined;
  inputTodo:string="";
  constructor(){

  }

  ngOnInit(): void {
      this.todos=[
        {
          content:'First todo',
          completed:false
        },        {
          content:'Second todo',
          completed:false
        },
      ]
  }

  toggleDone(id:number){
      this.todos?.map((v,i)=>{
        if(i==id) v.completed=!v.completed;
        return v;
      })
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