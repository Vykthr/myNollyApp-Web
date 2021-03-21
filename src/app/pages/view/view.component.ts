import { GeneralService } from './../../services/general/general.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  viewing: any;
  public innerWidth: any;
  public innerHeight: any;

  constructor(public general: GeneralService, private router: Router, private elRef:ElementRef, private route: ActivatedRoute) { 
  }

  ngOnInit(): void {
    let loader = this.elRef.nativeElement.querySelector('#loader'); 
    setTimeout(() => {
      loader.style.display = "none"
    }, 5000)
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    let title: any = this.route.snapshot.paramMap.get('id');
    if(!title) this.router.navigateByUrl('page-404')
    else {
      this.general.getValue().subscribe(async (movies) => {
        setTimeout(() => 
        {this.general.setViewing(
          movies.filter((movie: any) => (movie.details.title.toLowerCase() == title.replaceAll('-', ' ').toLowerCase()))[0])}, 1000)
      })
      this.general.getViewing().subscribe(value => {
        this.viewing = value;
        this.general.onActivate();
        if(this.general.movieList.value.length > 10 && this.viewing == undefined){
          this.router.navigateByUrl('page-404')
        }
      })
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

}
