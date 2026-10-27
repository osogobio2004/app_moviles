import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissionFormPage } from './mission-form.page';

describe('MissionFormPage', () => {
  let component: MissionFormPage;
  let fixture: ComponentFixture<MissionFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
