import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteUserAdminComponent } from './promote-user-admin.component';

describe('PromoteUserAdminComponent', () => {
  let component: PromoteUserAdminComponent;
  let fixture: ComponentFixture<PromoteUserAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoteUserAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromoteUserAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
