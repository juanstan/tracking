import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';

import { SettingsPage } from './settings';
import { SettingsPageRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SettingsPageRoutingModule,
    SwiperModule
  ],
  declarations: [SettingsPage],
  entryComponents: [SettingsPage],
})
export class SettingsModule {}
