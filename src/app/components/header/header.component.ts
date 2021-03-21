import { GeneralService } from './../../services/general/general.service';
import { AuthGuard } from './../../services/auth/auth.guard';
import { Component, OnInit, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() drawer: any;
  loader: any;

  constructor( private elRef:ElementRef, public auth: AuthGuard, public general: GeneralService) { }

  ngOnInit(): void {
    this.loader = this.elRef.nativeElement.querySelector('#navbarNavDropdown');
    // this.toggleMenu();
  }

  toggleMenu() {    
    this.loader.classList.toggle('show');
  }
}
