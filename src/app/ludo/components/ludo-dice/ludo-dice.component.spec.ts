import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LudoDiceComponent } from './ludo-dice.component';

describe('LudoDiceComponent', () => {
  let component: LudoDiceComponent;
  let fixture: ComponentFixture<LudoDiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoDiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LudoDiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
