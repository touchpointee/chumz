import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createCustomerAccessToken, getCustomer } from '@/lib/shopify';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    defaultAddress?: {
        address1: string;
        address2?: string;
        city: string;
        province: string;
        zip: string;
        country: string;
    };
}

interface AuthStore {
    user: User | null;
    accessToken: string | null;
    isGuest: boolean;
    isLoading: boolean;

    login: (email: string, password: string) => Promise<string | null>;
    logout: () => void;
    continueAsGuest: () => void;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            isGuest: false,
            isLoading: false,

            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    const result = await createCustomerAccessToken(email, password);
                    if (result.customerUserErrors?.length > 0) {
                        throw new Error(result.customerUserErrors[0].message);
                    }
                    const token = result.customerAccessToken.accessToken;
                    set({ accessToken: token, isGuest: false });
                    await get().fetchUser();
                    return null; // success
                } catch (error: any) {
                    console.error("Login failed:", error);
                    return error.message || "Invalid credentials";
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: () => {
                set({ user: null, accessToken: null, isGuest: false });
            },

            continueAsGuest: () => {
                set({ isGuest: true });
            },

            fetchUser: async () => {
                const { accessToken } = get();
                if (!accessToken) return;
                set({ isLoading: true });
                try {
                    const user = await getCustomer(accessToken);
                    set({ user });
                } catch (error) {
                    console.error("Fetch user failed:", error);
                    // If fetch fails (token expired), logout?
                    // set({ accessToken: null, user: null });
                } finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: 'shopify-auth',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
