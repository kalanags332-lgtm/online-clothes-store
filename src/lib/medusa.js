import Medusa from "@medusajs/medusa-js";

const BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const medusa = new Medusa({ baseUrl: BACKEND_URL, maxRetries: 3 });

export async function getProducts() {
  try {
    const { products } = await medusa.products.list();
    
    return products.map(p => {
      // Medusa prices are typically in cents (e.g. 4000 = $40.00)
      const priceAmount = p.variants?.[0]?.prices?.[0]?.amount || 0;
      const price = priceAmount / 100;
      
      return {
        id: p.id,
        name: p.title,
        handle: p.handle,
        price: price,
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
