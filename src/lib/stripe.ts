import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!;

export async function createCheckoutSession(
  userId: string,
  customerEmail: string
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: customerEmail,
    line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/deals?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/deals`,
    metadata: { userId },
  });
  return session.url || "";
}

export async function isProSubscriber(
  customerEmail: string
): Promise<boolean> {
  const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
  if (customers.data.length === 0) return false;

  const subscriptions = await stripe.subscriptions.list({
    customer: customers.data[0].id,
    status: "active",
    limit: 1,
  });
  return subscriptions.data.length > 0;
}
