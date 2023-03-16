import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LudoOnlineComponent } from './ludo-online.component';

describe('LudoOnlineComponent', () => {
  let component: LudoOnlineComponent;
  let fixture: ComponentFixture<LudoOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoOnlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LudoOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
