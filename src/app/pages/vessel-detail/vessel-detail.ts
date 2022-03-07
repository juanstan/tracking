import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConferenceData } from '../../providers/conference-data';
import { ActionSheetController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {Vessel} from '../../model/vessel';
import {VesselService} from '../../providers/vessel.service';

@Component({
  selector: 'page-vessel-detail',
  templateUrl: 'vessel-detail.html',
  styleUrls: ['./vessel-detail.scss'],
})
export class VesselDetailPage {
  vesselID: number;
  vessel: Vessel;

  constructor(
    private route: ActivatedRoute,
    public actionSheetCtrl: ActionSheetController,
    public confData: ConferenceData,
    public inAppBrowser: InAppBrowser,
    private vesselService: VesselService
  ) {}

  ionViewWillEnter() {
    // tslint:disable-next-line:radix
    this.vesselID = parseInt(this.route.snapshot.paramMap.get('vesselId'));
    this.vessel = this.vesselService.getVessel(this.vesselID);
    /*this.dataProvider.load().subscribe((data: any) => {
      const speakerId = this.route.snapshot.paramMap.get('speakerId');
      if (data && data.speakers) {
        for (const speaker of data.speakers) {
          if (speaker && speaker.id === speakerId) {
            this.speaker = speaker;
            break;
          }
        }
      }
    });*/
  }

  openExternalUrl(url: string) {
    this.inAppBrowser.create(
      url,
      '_blank'
    );
  }

  async openSpeakerShare(vessel: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Share ' + vessel.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            /*if (
              (window as any).cordova &&
              (window as any).cordova.plugins.clipboard
            ) {
              (window as any).cordova.plugins.clipboard.copy(
                'https://twitter.com/' + speaker.twitter
              );
            }*/
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async openContact(vessel: any) {
    const mode = 'ios'; // this.config.get('mode');

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Vessel ' + vessel.name,
      buttons: [
        {
          text: `Position ( ${vessel.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
              window.open(`position: ${vessel.longitude}, ${vessel.latitude}`);
          }
        },
        /*{
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + speaker.phone);
          }
        },*/
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }
}
