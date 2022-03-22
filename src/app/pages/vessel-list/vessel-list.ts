import { Component } from '@angular/core';
import {VesselService} from '../../providers/vessel.service';
import {Vessel} from '../../model/vessel';

@Component({
  selector: 'page-vessel-list',
  templateUrl: 'vessel-list.html',
  styleUrls: ['./vessel-list.scss'],
})
export class VesselListPage {
  vessels: Vessel[] = [];
  vesselSelected: Vessel;

  constructor(private vesselService: VesselService) {}

  ionViewDidEnter() {
   this.vessels = this.vesselService.vessels;
   this.checkVesselSelected();
  }

  selectVessel(vessel: Vessel) {
    this.vesselService.setVesselSelected(vessel.id);
    if (vessel === this.vesselSelected) {
      this.vesselService.setVesselSelected(null);
    }
    this.checkVesselSelected();
  }

  checkVesselSelected() {
    this.vesselSelected = this.vesselService.getVesselSelected();
    debugger;
  }

}
