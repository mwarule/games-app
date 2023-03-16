import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LudoHomeComponent } from './ludo-home.component';

describe('LudoHomeComponent', () => {
  let component: LudoHomeComponent;
  let fixture: ComponentFixture<LudoHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LudoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
