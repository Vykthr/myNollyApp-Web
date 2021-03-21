import { Router } from '@angular/router';
import { GeneralService } from './../../services/general/general.service';
import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-min-slider',
  templateUrl: './min-slider.component.html',
  styleUrls: ['./min-slider.component.css']
})
export class MinSliderComponent implements OnInit {
  @Input() movieList: any = [];
  @Input() secondFrame: any = false;
  @Input() language: any = false;
  customOptions: OwlOptions = {
    loop: true,
    margin: 10,
    items: 6,
    autoplay:true,
    dots: false,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1
      },
      180: {
        items: 2
      },
      360: {
        items: 3
      },
      540: {
        items: 4
      },
      720: {
        items: 5
      },
      900: {
        items: 6
      },
    },
    nav: true
  }

  constructor(public general: GeneralService, private router: Router, private elRef: ElementRef) {
  }

  ngOnInit(): void {
  }

  
  getRate(votes: any, views: any) {
    let rating = (votes/views) * 5;
    if (rating >= 5 ) {
    return 5;
    } else {
      return rating.toFixed(1)
    }
  }
    
  getRating(rate: any) {
    let extra = (parseFloat(rate).toFixed(2)) as any % 1;
    let rating = parseInt(rate)
    let stars = ``;
    while (rating > 0) {
      stars += `<i class="fa fa-star full"></i>`
      rating = rating - 1
    } 
    if(extra > 0) stars += `<i class="fa fa-star-half-o half"></i>`
    let empty = extra <= 0 ? 5 - parseInt(rate) : 5 - (parseInt(rate) + 1);
    while (empty > 0) {
      stars += `<i class="fa fa-star-o"></i>`
      empty = empty - 1
    } 
    return stars   
  }

}
