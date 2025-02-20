import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoAnyadirComponent } from './producto-anyadir.component';

describe('ProductoAnyadirComponent', () => {
  let component: ProductoAnyadirComponent;
  let fixture: ComponentFixture<ProductoAnyadirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoAnyadirComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoAnyadirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
