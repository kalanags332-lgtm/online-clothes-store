const BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || "https://my-medusa-clothstore-backend-production.up.railway.app";
const API_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY;

export async function getProducts(searchQuery = '') {
  console.log("Target Backend:", BACKEND_URL);
  console.log("API Key Status:", API_KEY ? "Configured" : "MISSING");
  
  const formattedUrl = BACKEND_URL?.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;

  try {
    // 1. We must have a region_id to get calculated prices in Medusa v2
    const regRes = await fetch(`${formattedUrl}/store/regions`, { 
      headers: { "x-publishable-api-key": API_KEY } 
    });
    const regData = await regRes.json();
    const regionId = regData.regions?.[0]?.id;

    // 2. Build the products endpoint with necessary fields and region context
    const query = new URLSearchParams({
      fields: "*variants.calculated_price",
      region_id: regionId
    });

    if (searchQuery) {
      query.append("q", searchQuery);
    }

    const endpoint = `${formattedUrl}/store/products?${query.toString()}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        "x-publishable-api-key": API_KEY,
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Medusa API Error Response:", errorText);
      return [];
    }
    
    const data = await response.json();
    const products = data.products || [];
    
    return products.map(p => {
      const variant = p.variants?.[0];
      
      // Use the calculated_amount which is now populated thanks to region_id
      const priceAmount = variant?.calculated_price?.calculated_amount ?? 
                         variant?.prices?.[0]?.amount ?? 0;
      
      return {
        id: p.id,
        variantId: variant?.id,
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

export async function createCart() {
  const formattedUrl = BACKEND_URL?.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
  try {
    const regRes = await fetch(`${formattedUrl}/store/regions`, { headers: { "x-publishable-api-key": API_KEY } });
    const regData = await regRes.json();
    const regionId = regData.regions?.[0]?.id;

    const res = await fetch(`${formattedUrl}/store/carts`, {
      method: "POST",
      headers: { "x-publishable-api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ region_id: regionId })
    });
    const data = await res.json();
    if (data.cart?.id) localStorage.setItem('medusa_cart_id', data.cart.id);
    return data.cart?.id;
  } catch (e) {
    console.error("Cart creation failed:", e);
  }
}

export async function addToCart(variantId, quantity = 1) {
  let cartId = localStorage.getItem('medusa_cart_id');
  if (!cartId) cartId = await createCart();
  if (!cartId) return false;
  
  const formattedUrl = BACKEND_URL?.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
  try {
    const res = await fetch(`${formattedUrl}/store/carts/${cartId}/line-items`, {
      method: "POST",
      headers: { "x-publishable-api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ variant_id: variantId, quantity })
    });
    return res.ok;
  } catch (e) {
    console.error("Add to cart failed", e);
    return false;
  }
}

export async function getCart() {
  const cartId = localStorage.getItem('medusa_cart_id');
  if (!cartId) return null;
  const formattedUrl = BACKEND_URL?.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
  try {
    const res = await fetch(`${formattedUrl}/store/carts/${cartId}`, {
      headers: { "x-publishable-api-key": API_KEY }
    });
    const data = await res.json();
    return data.cart || null;
  } catch (e) {
    console.error("Fetch cart failed", e);
    return null;
  }
}

export async function removeFromCart(lineItemId) {
  const cartId = localStorage.getItem('medusa_cart_id');
  if (!cartId) return false;
  const formattedUrl = BACKEND_URL?.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
  try {
    const res = await fetch(`${formattedUrl}/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: "DELETE",
      headers: { "x-publishable-api-key": API_KEY }
    });
    return res.ok;
  } catch (e) {
    console.error("Remove from cart failed", e);
    return false;
  }
}

// === CUSTOMER AUTHENTICATION ===

export async function registerCustomer(firstName, lastName, email, password) {
  const formattedUrl = BACKEND_URL?.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
  try {
    const res = await fetch(`${formattedUrl}/store/customers`, {
      method: 'POST',
      headers: { "x-publishable-api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password })
    });
    if (!res.ok) return { error: await res.text() };
    const data = await res.json();
    return { customer: data.customer };
  } catch (e) {
    return { error: e.message };
  }
}

export async function loginCustomer(email, password) {
  const formattedUrl = BACKEND_URL?.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
  try {
    // Note: V2 uses provider auth. Falling back to simple REST standards
    // Depending heavily on how your medusa config is structured for auth CORS
    const res = await fetch(`${formattedUrl}/store/auth`, {
      method: "POST",
      headers: { "x-publishable-api-key": API_KEY, "Content-Type": "application/json" },
      credentials: "omit", // Using token/local storage for simplicity to bypass Strict CORS
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) return { error: await res.text() };
    const data = await res.json();
    return { customer: data.customer };
  } catch (e) {
    return { error: e.message };
  }
}
