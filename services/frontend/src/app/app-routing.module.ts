import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AppComponent } from './app.component';
import { VirtualForestComponent } from './components/virtual-forest/virtual-forest.component';
import { BlogComponent } from './components/blog/blog.component';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { HomeComponent } from './components/home/home.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { TodosComponent } from './components/todos/todos.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

const routes: Routes = [
  
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path:'forgot-password', component:ForgotPasswordComponent},
  { path: 'profile', component: ProfileComponent },
  { path: 'virtualforest', component: VirtualForestComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'todolist', component: TodosComponent },
  { path: 'settings', component: SettingsComponent },
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
