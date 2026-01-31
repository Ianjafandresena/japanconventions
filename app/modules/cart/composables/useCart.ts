import type { CartItem } from '../types/CartItem';

export const useCart = () => {
    // Shared state for the cart
    const cart = useState<CartItem[]>('cart', () => [
        // Dummy data for initial demonstration
        {
            id: '1',
            festivalName: 'Japan Otaku Festival',
            city: 'Marseille',
            venue: 'Parc Chanot',
            date: '2025-05-24',
            price: 15,
            quantity: 2,
            image: 'https://japanconventions.com/wp-content/uploads/2025/08/Japan-Otaku-festival-Logo-1536x1536-1-3.png'
        },
        {
            id: '2',
            festivalName: 'Japan Manga Wave',
            city: 'Lyon',
            venue: 'Eurexpo',
            date: '2025-06-12',
            price: 12,
            quantity: 1,
            image: 'https://japanconventions.com/wp-content/uploads/2025/08/LOGO-JMW-A-carree-1.png'
        }
    ]);

    const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));
    const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0));

    const addItem = (item: CartItem) => {
        const existing = cart.value.find(i => i.id === item.id);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            cart.value.push(item);
        }
    };

    const removeItem = (id: string) => {
        const index = cart.value.findIndex(item => item.id === id);
        if (index > -1) {
            cart.value.splice(index, 1);
        }
    };

    const updateQuantity = (id: string, quantity: number) => {
        const item = cart.value.find(i => i.id === id);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) removeItem(id);
        }
    };

    const clearCart = () => {
        cart.value = [];
    };

    const isDrawerOpen = useState('cartDrawer', () => false);

    const toggleDrawer = () => {
        isDrawerOpen.value = !isDrawerOpen.value;
    };

    const closeDrawer = () => {
        isDrawerOpen.value = false;
    };

    return {
        cart,
        cartCount,
        cartTotal,
        isDrawerOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleDrawer,
        closeDrawer
    };
};
