import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualForestComponent } from './virtual-forest.component';

describe('VirtualForestComponent', () => {
  let component: VirtualForestComponent;
  let fixture: ComponentFixture<VirtualForestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualForestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualForestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
