const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const token = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function testShopify() {
  const query = `
    {
      products(first: 3) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query }),
  });

  const body = await response.json();
  console.log(JSON.stringify(body, null, 2));
}

testShopify();
