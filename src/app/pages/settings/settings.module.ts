import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsPage } from './settings';
import { SettingsPageRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SettingsPageRoutingModule,
    SwiperModule,
    ReactiveFormsModule
  ],
  declarations: [SettingsPage],
  entryComponents: [SettingsPage],
})
export class SettingsModule {}
