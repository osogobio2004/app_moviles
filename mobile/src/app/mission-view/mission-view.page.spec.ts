import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissionViewPage } from './mission-view.page';

describe('MissionViewPage', () => {
  let component: MissionViewPage;
  let fixture: ComponentFixture<MissionViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
