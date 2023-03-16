import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LudoSearchingComponent } from './ludo-searching.component';

describe('LudoSearchingComponent', () => {
  let component: LudoSearchingComponent;
  let fixture: ComponentFixture<LudoSearchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoSearchingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LudoSearchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
