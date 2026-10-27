import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissionListPage } from './mission-list.page';

describe('MissionListPage', () => {
  let component: MissionListPage;
  let fixture: ComponentFixture<MissionListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
