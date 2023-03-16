import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LudoPassPlayComponent } from './ludo-pass-play.component';

describe('LudoPassPlayComponent', () => {
  let component: LudoPassPlayComponent;
  let fixture: ComponentFixture<LudoPassPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoPassPlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LudoPassPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
