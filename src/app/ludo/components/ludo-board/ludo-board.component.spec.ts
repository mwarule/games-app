import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LudoBoardComponent } from './ludo-board.component';

describe('LudoBoardComponent', () => {
  let component: LudoBoardComponent;
  let fixture: ComponentFixture<LudoBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LudoBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
