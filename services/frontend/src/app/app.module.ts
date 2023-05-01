import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { VirtualForestComponent } from './components/virtual-forest/virtual-forest.component';
import { BlogComponent } from './components/blog/blog.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    VirtualForestComponent,
    BlogComponent,
    CalculatorComponent,
    ToDoListComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
