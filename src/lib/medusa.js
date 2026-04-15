import Medusa from "@medusajs/medusa-js";

const BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const medusa = new Medusa({ 
  baseUrl: BACKEND_URL, 
  publishableApiKey: import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
  maxRetries: 3 
});

export async function getProducts() {
  try {
    // Medusa v2 requires explicit field selection for calculated prices
    const { products } = await medusa.products.list({
      fields: "*variants.calculated_price"
    });
    
    return products.map(p => {
      const variant = p.variants?.[0];
      
      // Extract price from Medusa v2 calculated_price field
      // If the backend uses major units (e.g. 10.00 is 10), we don't divide by 100.
      // Based on our Medusa v2 setup, we check for calculated_amount.
      const priceAmount = variant?.calculated_price?.calculated_amount ?? 0;
      
      return {
        id: p.id,
        name: p.title,
        handle: p.handle,
        price: priceAmount,
        category: p.collection?.title || 'Uncategorized',
        image: p.thumbnail || null,
        rating: 4.5
      };
    });
  } catch (error) {
    console.error("Error fetching from Medusa API:", error);
    return [];
  }
}

export async function createCheckout(lineItems) {
  try {
    // 1. Create a Medusa cart
    const { cart } = await medusa.carts.create();
    
    // 2. Add items to cart (in a real Medusa flow, lineItems must contain real Medusa variant IDs)
    for (const item of lineItems) {
      // We assume item.id is the variant_id for this simplified demo
      await medusa.carts.lineItems.create(cart.id, {
        variant_id: item.id,
        quantity: item.quantity
      });
    }
    
    // 3. Return the checkout URL natively, or navigate to a custom frontend checkout page
    // Medusa typically requires a custom checkout flow on the frontend or a direct link if using a hosted checkout
    return `/checkout/${cart.id}`;
    
  } catch (error) {
    console.error("Error creating Medusa Checkout:", error);
    return null;
  }
}
