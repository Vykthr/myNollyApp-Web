import { GeneralService } from './../../services/general/general.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  list: any;
  constructor(public general: GeneralService, private elRef:ElementRef) { 
  }
  customOptions: OwlOptions = {
    loop: true,
    margin: 10,
    autoplay:true,
    dots: false,
    navText: ['Previous', 'Next'],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: true
  }

  ngOnInit(): void {
    this.general.getValue().subscribe(res => {
      this.list = res;
    })
    let loader = this.elRef.nativeElement.querySelector('#loader'); 

    setTimeout(() => {
      loader.style.display = "none"
    }, 3000)
  }

}
