const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch({ query, variables = {} }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken
      },
      body: JSON.stringify({ query, variables })
    });

    const { data, errors } = await result.json();

    if (errors) {
      console.error('Shopify API Errors:', errors);
      throw new Error('Failed to fetch from Shopify API');
    }

    return { status: result.status, body: data };
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    return { status: 500, error: 'Error receiving data' };
  }
}

export async function getProducts() {
  const query = `
    {
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            productType
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query });
  
  if (!response.body || !response.body.products) {
    return [];
  }

  // Map Shopify's structure to our app's structure
  return response.body.products.edges.map(({ node }) => ({
    id: node.id,
    name: node.title,
    handle: node.handle,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    category: node.productType || 'Uncategorized',
    image: node.images.edges[0]?.node.url || null,
    rating: 4.5 
  }));
}

export async function createCheckout(lineItems) {
  const query = `
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;
  
  // This is a placeholder payload for checkout structure
  const variables = {
    input: {
      lines: lineItems.map(item => ({
        merchandiseId: item.id,
        quantity: item.quantity
      }))
    }
  };

  const response = await shopifyFetch({ query, variables });

  if (response.body && response.body.cartCreate && response.body.cartCreate.cart) {
    return response.body.cartCreate.cart.checkoutUrl;
  }
  
  return null;
}
