import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VirtualForestComponent } from './components/virtual-forest/virtual-forest.component';
import { BlogComponent } from './components/blog/blog.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './containers/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { VerticalNavbarComponent } from './components/vertical-navbar/vertical-navbar.component';
import { SectionComponent } from './components/section/section.component';
import { CardComponent } from './components/card/card.component';
import { TodosComponent } from './components/todos/todos.component';
import { HttpClientModule } from '@angular/common/http';
import { SettingsComponent } from './components/settings/settings.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ToastComponent } from './components/toast/toast.component';
import { ToastrModule } from 'ngx-toastr';
import { KanbanComponent } from './components/kanban/kanban.component';
import { DetailTaskComponent } from './modals/detail-task/detail-task.component';
import { SuggestTaskComponent } from './modals/suggest-task/suggest-task.component';
import { ShareTaskComponent } from './modals/share-task/share-task.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    VirtualForestComponent,
    BlogComponent,
    CalculatorComponent,
    ToDoListComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    NavbarComponent,
    VerticalNavbarComponent,
    SectionComponent,
    CardComponent,
    TodosComponent,
    SettingsComponent,
    ForgotPasswordComponent,
    PageNotFoundComponent,
    ProfileComponent,
    ToastComponent,
    KanbanComponent,
    DetailTaskComponent,
    SuggestTaskComponent,
    ShareTaskComponent,
      ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule ,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      easeTime:300,
      positionClass: 'toast-bottom-right',
      progressBar:true,
      progressAnimation:"increasing",
    }),
    BrowserAnimationsModule, 
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
