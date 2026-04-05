const BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL;
const API_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY;

export async function getProducts() {
  try {
    const formattedUrl = BACKEND_URL?.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
    const response = await fetch(`${formattedUrl}/store/products`, {
      method: 'GET',
      headers: {
        "x-publishable-api-key": API_KEY,
      }
    });

    if (!response.ok) {
      console.error("Medusa API Error Response:", await response.text());
      return [];
    }
    
    const data = await response.json();
    const products = data.products || [];
    
    return products.map(p => {
      let priceAmount = 0;
      if (p.variants && p.variants.length > 0) {
        const v = p.variants[0];
        priceAmount = v.calculated_price?.calculated_amount || v.prices?.[0]?.amount || 0;
      }
      
      return {
        id: p.id,
        name: p.title,
        handle: p.handle,
        price: priceAmount,
        category: p.collection?.title || p.categories?.[0]?.name || 'Uncategorized',
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
