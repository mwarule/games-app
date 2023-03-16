import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LudoConfigComponent } from './ludo-config.component';

describe('LudoConfigComponent', () => {
  let component: LudoConfigComponent;
  let fixture: ComponentFixture<LudoConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LudoConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
