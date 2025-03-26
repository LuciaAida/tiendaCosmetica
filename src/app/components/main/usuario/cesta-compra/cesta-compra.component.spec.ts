import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CestaCompraComponent } from './cesta-compra.component';

describe('CestaCompraComponent', () => {
  let component: CestaCompraComponent;
  let fixture: ComponentFixture<CestaCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CestaCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CestaCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
