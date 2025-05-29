// utils/stripe.ts
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  'pk_test_51RDLHuG1eE703SfV5bZ9aIMzdmv1l31xFab5KWsMXOvbz6EQ4rU4LeJ1KY1bHMbbFhVSUu1ZsfU3gQSvRAorSks800r9iNKI90'
); // Replace this!
