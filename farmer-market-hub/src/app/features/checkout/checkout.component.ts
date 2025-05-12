import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Observable, map, finalize, switchMap } from 'rxjs';
import { Cart } from '../../core/models/cart.model';
import { CartItem } from '../../core/models/cart-item.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styles: [`
    :host {
      display: block;
      font-family: sans-serif;
      padding: 2rem;
      background-color: #f9f9f9;
    }

    .checkout-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    h1, h2 {
      color: #333;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.5rem;
    }

    .checkout-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .checkout-details section {
      background-color: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #555;
    }

    .form-group input[type="text"],
    .form-group input[type="email"],
    .form-group input[type="tel"] {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .form-row .form-group {
      flex: 1;
    }

    .form-row .city {
      flex: 2;
    }

    .order-summary {
      background-color: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 2rem; /* Adjust as needed */
    }

    .summary-item {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .summary-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .summary-item-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 1rem;
    }

    .summary-item-details {
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .summary-item-details span:first-child {
      color: #555;
    }

    .summary-item-details span:last-child {
      font-weight: bold;
    }

    .summary-totals p {
      display: flex;
      justify-content: space-between;
      margin: 0.5rem 0;
      color: #555;
    }

    .summary-totals p.total {
      font-size: 1.2rem;
      font-weight: bold;
      color: #333;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    hr {
      border: none;
      border-top: 1px solid #eee;
      margin: 1.5rem 0;
    }

    .place-order-button {
      display: block;
      width: 100%;
      padding: 1rem;
      background-color: #28a745; /* Green */
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-top: 1.5rem;
    }

    .place-order-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .place-order-button:not(:disabled):hover {
      background-color: #218838; /* Darker green */
    }

    .payment-options p {
        color: #888;
        font-style: italic;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .checkout-grid {
        grid-template-columns: 1fr;
      }

      .order-summary {
        position: static;
        margin-top: 2rem;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup; // Renamed from shippingForm
  paymentForm: FormGroup;
  cartItems: CartItem[] = [];
  cartSubtotal: number = 0;
  shippingCost: number = 5.99; // Example fixed shipping
  taxRate: number = 0.08; // Example tax rate (8%)
  taxAmount: number = 0;
  cartTotal: number = 0;
  isLoading: boolean = false;
  error: string | null = null;

  private cartItems$: Observable<CartItem[]>; // Keep original observable for internal use

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.cartItems$.pipe(
      map(cart => cart ? cart.items : [])
    );

    this.checkoutForm = this.formBuilder.group({
      // Shipping fields
      fullName: ['', Validators.required], // Match HTML
      addressLine1: ['', Validators.required], // Match HTML
      addressLine2: [''], // Match HTML
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
      phoneNumber: ['', Validators.required] // Match HTML
    });

    this.paymentForm = this.formBuilder.group({
      paymentMethod: ['card', Validators.required],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      upiId: ['']
    });

    // Add conditional validators based on payment method
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      const cardNumber = this.paymentForm.get('cardNumber');
      const expiryDate = this.paymentForm.get('expiryDate');
      const cvv = this.paymentForm.get('cvv');
      const upiId = this.paymentForm.get('upiId');

      if (method === 'card') {
        cardNumber?.setValidators([Validators.required, Validators.pattern('^[0-9]{16}$')]);
        expiryDate?.setValidators([Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]);
        cvv?.setValidators([Validators.required, Validators.pattern('^[0-9]{3,4}$')]);
        upiId?.clearValidators();
      } else if (method === 'upi') {
        upiId?.setValidators([Validators.required, Validators.pattern('^[\\w\\.-]+@[\\w\\.-]+$')]);
        cardNumber?.clearValidators();
        expiryDate?.clearValidators();
        cvv?.clearValidators();
      }

      cardNumber?.updateValueAndValidity();
      expiryDate?.updateValueAndValidity();
      cvv?.updateValueAndValidity();
      upiId?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });

    // Initialize payment form conditional validators
    this.paymentForm.get('paymentMethod')?.updateValueAndValidity();
  }

  calculateTotals(): void {
    this.cartSubtotal = this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
    this.taxAmount = this.cartSubtotal * this.taxRate;
    this.cartTotal = this.cartSubtotal + this.shippingCost + this.taxAmount;
  }

  // Removed step logic as the new design is single-page
  // previousStep(): void { ... }
  // nextStep(): void { ... }

  onSubmit(): void {
    // This function is linked to (ngSubmit) in the HTML form tag
    // Currently, the button is outside the form, so placeOrder is used via (click)
    console.log('Form submitted (though button is outside form)');
    this.placeOrder();
  }

  placeOrder(): void {
    // Mark fields as touched to show validation errors
    this.checkoutForm.markAllAsTouched();
    this.paymentForm.markAllAsTouched();

    if (this.checkoutForm.valid && this.paymentForm.valid) {
      if (this.cartItems.length === 0) {
        this.error = 'Your cart is empty.';
        return;
      }

      this.isLoading = true;
      this.error = null;

      // Use the latest cart items directly from the property
      const orderItems = this.cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));

      // Format delivery address from checkoutForm
      const formValues = this.checkoutForm.value;
      const deliveryAddress = `${formValues.fullName}, ${formValues.addressLine1}${formValues.addressLine2 ? ', ' + formValues.addressLine2 : ''}, ${formValues.city}, ${formValues.state} ${formValues.zipCode}, Phone: ${formValues.phoneNumber}`;

      const paymentDetails = this.paymentForm.value;
      const orderData = {
        deliveryAddress,
        items: orderItems,
        paymentMethod: paymentDetails.paymentMethod,
        // Conditionally add payment details based on method
        ...(paymentDetails.paymentMethod === 'card' && {
          cardNumber: paymentDetails.cardNumber, // Consider masking/security
          expiryDate: paymentDetails.expiryDate,
          cvv: paymentDetails.cvv // Consider security
        }),
        ...(paymentDetails.paymentMethod === 'upi' && {
          upiId: paymentDetails.upiId
        })
      };

      this.orderService.createOrder(orderData).pipe(
        switchMap(() => this.cartService.clearCart()),
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: () => {
          this.router.navigate(['/order-success']);
        },
        error: (err) => {
          this.error = 'Failed to place order. Please try again.';
          console.error('Order error:', err);
        }
      });
    } else {
      if (!this.checkoutForm.valid) {
         this.error = 'Please fill in all required shipping fields correctly.';
      } else if (!this.paymentForm.valid) {
         this.error = 'Please fill in all required payment details correctly.';
      } else {
         this.error = 'Please correct the errors in the form.';
      }
    }
  }
}