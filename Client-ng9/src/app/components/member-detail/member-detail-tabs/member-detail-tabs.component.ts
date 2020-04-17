import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from '../../../_services/interfaces';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {MatTabGroup} from '@angular/material/tabs';
import {BehaviorSubject, Subscription} from 'rxjs';
import {TabsService} from '../../../_services/tabs.service';

@Component({
  selector: 'app-member-detail-tabs',
  templateUrl: './member-detail-tabs.component.html',
  styleUrls: ['./member-detail-tabs.component.scss']
})
export class MemberDetailTabsComponent implements OnInit, OnDestroy {

  unsubscribe: Subscription;
  @Input() user: User;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  @ViewChild('memberTabs', {static: true}) memberTabs: MatTabGroup;

  constructor(private tabService: TabsService) {
  }

  ngOnInit(): void {
    this.unsubscribe = this.tabService.getTabIndex
      .subscribe(index => {
        this.memberTabs.selectedIndex = index;
      });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 5,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];
    this.galleryImages = this.getImages();
  }

  getImages() {
    console.log('users photos: ', this.user.photos);
    return this.user.photos.map(p => ({
      small: p.url,
      medium: p.url,
      big: p.url,
      description: p.description
    }));
  }

  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe();
  }
}
