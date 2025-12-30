import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct } from '@/lib/shopify';

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;

  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  createCheckout: () => Promise<void>;
}

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function createStorefrontCheckout(items: CartItem[]): Promise<string> {
  const SHOPIFY_STORE_PERMANENT_DOMAIN = 'chumz-comfort-shop-it1mm.myshopify.com';
  const SHOPIFY_API_VERSION = '2025-07';
  const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
  const SHOPIFY_STOREFRONT_TOKEN = '6e907a2a2a0351a97998f8756f063e75';

  try {
    const lines = items.map(item => ({
      quantity: item.quantity,
      merchandiseId: item.variantId,
    }));

    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
      },
      body: JSON.stringify({
        query: CART_CREATE_MUTATION,
        variables: {
          input: {
            lines,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cartData = await response.json();

    if (cartData.data.cartCreate.userErrors.length > 0) {
      throw new Error(`Cart creation failed: ${cartData.data.cartCreate.userErrors.map((e: any) => e.message).join(', ')}`);
    }

    const cart = cartData.data.cartCreate.cart;

    if (!cart.checkoutUrl) {
      throw new Error('No checkout URL returned from Shopify');
    }

    const url = new URL(cart.checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    const checkoutUrl = url.toString();
    return checkoutUrl;
  } catch (error) {
    console.error('Error creating storefront checkout:', error);
    throw error;
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);

        // GTM Add to Cart Event
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "add_to_cart",
          ecommerce: {
            currency: item.price.currencyCode,
            value: parseFloat(item.price.amount) * item.quantity,
            items: [{
              item_name: item.product.title,
              item_id: item.variantId,
              price: parseFloat(item.price.amount),
              quantity: item.quantity,
              item_variant: item.variantTitle
            }]
          }
        });

        if (existingItem) {
          set({
            items: items.map(i =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (variantId) => {
        const { items } = get();
        const itemToRemove = items.find(i => i.variantId === variantId);

        if (itemToRemove) {
          // GTM Remove from Cart Event
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "remove_from_cart",
            ecommerce: {
              currency: itemToRemove.price.currencyCode,
              value: parseFloat(itemToRemove.price.amount) * itemToRemove.quantity,
              items: [{
                item_name: itemToRemove.product.title,
                item_id: itemToRemove.variantId,
                price: parseFloat(itemToRemove.price.amount),
                quantity: itemToRemove.quantity,
                item_variant: itemToRemove.variantTitle
              }]
            }
          });
        }

        set({
          items: items.filter(item => item.variantId !== variantId)
        });
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },

      setCartId: (cartId) => set({ cartId }),
      setCheckoutUrl: (checkoutUrl) => set({ checkoutUrl }),
      setLoading: (isLoading) => set({ isLoading }),

      createCheckout: async () => {
        const { items, setLoading, setCheckoutUrl } = get();
        if (items.length === 0) return;

        setLoading(true);
        try {
          const checkoutUrl = await createStorefrontCheckout(items);
          setCheckoutUrl(checkoutUrl);
        } catch (error) {
          console.error('Failed to create checkout:', error);
        } finally {
          setLoading(false);
        }
      }
    }),
    {
      name: 'shopify-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
