const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'chumz-comfort-shop-it1mm.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '60ec1e02e4bff1d75357a1fbb8249a0f';

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    tags: string[];
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

export async function storefrontApiRequest(query: string, variables: any = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: any) => e.message).join(', ')}`);
  }

  return data;
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `#graphql
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      tags

      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }

      variants(first: 50) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }

      # 👇 NEW metafield section
      featureImages: metafield(namespace: "custom", key: "feature_images") {
        id
        type
        references(first: 20) {
          edges {
            node {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;


export async function getProducts(limit: number = 20) {
  const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: limit });
  return data.data.products.edges as ShopifyProduct[];
}

// Collection-based query - products are returned in the order set in Shopify Admin
const COLLECTION_PRODUCTS_QUERY = `
  query GetCollectionProducts($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      title
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            options {
              name
              values
            }
          }
        }
      }
    }
  }
`;

// Fetch products from a specific collection - order is controlled in Shopify Admin
export async function getProductsFromCollection(collectionHandle: string = 'all-products', limit: number = 20) {
  try {
    const data = await storefrontApiRequest(COLLECTION_PRODUCTS_QUERY, {
      handle: collectionHandle,
      first: limit
    });

    // If collection exists and has products, return them
    if (data.data.collectionByHandle?.products?.edges) {
      return data.data.collectionByHandle.products.edges as ShopifyProduct[];
    }

    // Fallback to regular products query if collection not found
    console.warn(`Collection "${collectionHandle}" not found, falling back to all products`);
    return getProducts(limit);
  } catch (error) {
    console.error('Error fetching collection products:', error);
    // Fallback to regular products query on error
    return getProducts(limit);
  }
}

export async function getProductByHandle(handle: string) {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data.data.productByHandle;
}

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        message
      }
    }
  }
`;

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        message
      }
    }
  }
`;

const GET_CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      defaultAddress {
        address1
        address2
        city
        province
        zip
        country
      }
    }
  }
`;

export async function createCustomerAccessToken(email: string, password: string) {
  const data = await storefrontApiRequest(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, {
    input: { email, password }
  });
  return data.data.customerAccessTokenCreate;
}

export async function createCustomer(input: any) {
  const data = await storefrontApiRequest(CUSTOMER_CREATE_MUTATION, { input });
  return data.data.customerCreate;
}

export async function getCustomer(accessToken: string) {
  const data = await storefrontApiRequest(GET_CUSTOMER_QUERY, { customerAccessToken: accessToken });
  return data.data.customer;
}

const GET_CUSTOMER_ORDERS_QUERY = `
  query getCustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            successfulFulfillments(first: 5) {
              trackingCompany
              trackingInfo {
                number
                url
              }
            }
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
            shippingAddress {
              address1
              city
              country
              zip
            }
          }
        }
      }
    }
  }
`;

export async function getCustomerOrders(accessToken: string) {
  const data = await storefrontApiRequest(GET_CUSTOMER_ORDERS_QUERY, { customerAccessToken: accessToken });
  return data.data.customer?.orders?.edges?.map((e: any) => e.node) || [];
}

const GET_ORDER_QUERY = `
  query getOrder($id: ID!) {
    node(id: $id) {
      ... on Order {
        id
        orderNumber
        processedAt
        financialStatus
        fulfillmentStatus
        successfulFulfillments(first: 5) {
          trackingCompany
          trackingInfo {
            number
            url
          }
        }
        totalPrice {
          amount
          currencyCode
        }
        subtotalPrice {
          amount
          currencyCode
        }
        totalShippingPrice {
          amount
          currencyCode
        }
        totalTax {
          amount
          currencyCode
        }
        lineItems(first: 20) {
          edges {
            node {
              title
              quantity
              originalTotalPrice {
                amount
                currencyCode
              }
              variant {
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
                product {
                  handle
                }
              }
            }
          }
        }
        shippingAddress {
          firstName
          lastName
          address1
          address2
          city
          province
          zip
          country
          phone
        }
      }
    }
  }
`;

export async function getOrder(id: string) {
  const data = await storefrontApiRequest(GET_ORDER_QUERY, { id });
  return data.data.node;
}

// Newsletter subscription - creates a customer with marketing consent
const NEWSLETTER_SUBSCRIBE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = await storefrontApiRequest(NEWSLETTER_SUBSCRIBE_MUTATION, {
      input: {
        email,
        acceptsMarketing: true,
        // Generate a random password since it's required but user won't use it
        password: Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)
      }
    });

    const result = data.data.customerCreate;

    if (result.customerUserErrors && result.customerUserErrors.length > 0) {
      const error = result.customerUserErrors[0];
      // If customer already exists
      if (error.code === 'TAKEN' || error.message.includes('already')) {
        return {
          success: false,
          message: "This email is already registered. Please log in to your account and enable marketing emails in your profile settings."
        };
      }
      return { success: false, message: error.message };
    }

    if (result.customer) {
      return { success: true, message: "Welcome to the Chumz community! 🎉" };
    }

    return { success: false, message: "Something went wrong. Please try again." };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { success: false, message: "Unable to subscribe. Please try again later." };
  }
}
