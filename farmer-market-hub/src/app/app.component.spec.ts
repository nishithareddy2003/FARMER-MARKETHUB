import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let cartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser$: of(null)
    });
    const cartServiceSpy = jasmine.createSpyObj('CartService', [], {
      cartItemCount$: of(0)
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppComponent,
        LoadingComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CartService, useValue: cartServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the \'farmer-market-hub\' title', () => {
    expect(component.title).toEqual('farmer-market-hub');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo span')?.textContent).toContain('Farmer Market Hub');
  });
});
