import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AppMenuComponent } from './components/app-menu/app-menu.component';
import { AppMenuitemComponent } from './components/app-menuitem/app-menuitem.component';
import { AppSidebarComponent } from './components/app-sidebar/app-sidebar.component';
import { AppTopbarComponent } from './components/app-topbar/app-topbar.component';
@NgModule({
  declarations: [
    AppLayoutComponent,
    AppMenuComponent,
    AppFooterComponent,
    AppMenuitemComponent,
    AppSidebarComponent,
    AppTopbarComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    RouterModule
  ],
  exports: [AppLayoutComponent]
})
export class LayoutModule { }
