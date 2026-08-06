import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RoleSelectionComponent } from './role-selection';

describe('RoleSelectionComponent', () => {
  let component: RoleSelectionComponent;
  let fixture: ComponentFixture<RoleSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleSelectionComponent],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RoleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain 7 roles', () => {
    expect(component.roles.length).toBe(7);
  });

  it('should have patient role', () => {
    expect(component.roles[0].id).toBe('patient');
  });

  it('should have doctor role', () => {
    expect(component.roles[1].id).toBe('doctor');
  });

  it('should have admin role', () => {
    expect(component.roles[6].id).toBe('admin');
  });

  it('should return role id in trackByRole()', () => {
    const role = component.roles[0];
    expect(component.trackByRole(0, role)).toBe(role.id);
  });
});
