import { GeneralService } from './../../services/general/general.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  favouriteList: any = []
  userDetails: any = {}

  constructor(public general: GeneralService) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.general.getUserValue().subscribe((res) => {
      this.userDetails = res;
      this.general.getValue().subscribe((movies) => {
        movies.forEach((movie: any) => { 
          if(this.userDetails.votes.includes(movie.id)) {
            this.favouriteList.push(movie)
          }
        })
      })
    })
  }

}
