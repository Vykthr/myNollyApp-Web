import { GeneralService } from './../../services/general/general.service';
import { AuthGuard } from './../../services/auth/auth.guard';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  date = new Date().getFullYear();
  constructor(public auth: AuthGuard, public general: GeneralService) { }

  ngOnInit(): void {
  }

}
