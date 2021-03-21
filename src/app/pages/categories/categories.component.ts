import { GeneralService } from './../../services/general/general.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  date: any;
  searchRes: any = [];
  searchForm: FormGroup;
  info: any;

  constructor(public general: GeneralService, private router: Router, private formBuillder: FormBuilder, private route: ActivatedRoute) {
    this.searchForm = this.formBuillder.group({
      title: [''],
      genre: ['all'],
      year: ['all'],
      language: ['all'],
      from: ['all'],
      type: ['all'],
    })
  }

  ngOnInit(): void {
    this.date = new Date().getFullYear()
    this.general.getValue().subscribe((value) => {
      if(value) this.searchRes = value;
    })

    this.route.paramMap.subscribe((res: any) => {
      this.info = this.route.snapshot.paramMap.get('id')
      if(this.router.url.includes('languages')) {
        this.searchForm.patchValue({language: this.info})
      } else if (this.info && this.info != 'recent') { this.searchForm.patchValue({genre: this.info})}
  
      this.search()
      this.general.onActivate();
    });

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

  viewMovie(movie: any) {
    this.general.setViewing(movie);
    this.router.navigate(['/movie/'+ movie.details.title.replaceAll(' ', '-')]);
  }

  search() {
    this.searchRes = this.general.movieList.value
    .filter((search: any) => search.details.title.toLowerCase().includes(this.searchForm.value.title.toLowerCase()))
    .filter((search: any) => (search.details.genre.includes(this.searchForm.value.genre.toLowerCase())) || (this.searchForm.value.genre == 'all'))
    .filter((search: any) => (search.details.language == this.searchForm.value.language) || (this.searchForm.value.language == 'all'))
    .filter((search: any) => (search.details.year == this.searchForm.value.year) || (this.searchForm.value.year == 'all'))
    .filter((search: any) => (search.details.from == this.searchForm.value.from) || (this.searchForm.value.from == 'all'))
    .filter((search: any) => (search.details.type == this.searchForm.value.type) || (this.searchForm.value.type == 'all'))
  }

}
