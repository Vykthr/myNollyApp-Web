import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinSliderComponent } from './min-slider.component';

describe('MinSliderComponent', () => {
  let component: MinSliderComponent;
  let fixture: ComponentFixture<MinSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
