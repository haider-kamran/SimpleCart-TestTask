import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Cart, type CartItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Trash2 } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Cart', href: '' },
];

export default function CartIndex() {
    const { cart: initialCart } = usePage<{ cart: Cart }>().props;
    const [cart, setCart] = useState<Cart>(initialCart);
    const [quantities, setQuantities] = useState<Record<number, number>>(
        initialCart.items.reduce(
            (acc, item) => {
                acc[item.id] = item.quantity;
                return acc;
            },
            {} as Record<number, number>,
        ),
    );

    const updateQuantity = async (item: CartItem, quantity: number) => {
        try {
            await axios.post('/cart/update', {
                _method: 'PATCH',
                item_id: item.id,
                quantity,
            });

            setCart((prev) => ({
                ...prev,
                items: prev.items.map((i) =>
                    i.id === item.id ? { ...i, quantity } : i,
                ),
            }));

            toast.success(`Quantity updated for ${item.product.name}`);
        } catch (error: any) {
            console.error('Failed to update cart', error);

            if (error.response?.status === 422) {
                const message =
                    error.response.data?.error ||
                    Object.values(error.response.data.errors || {})
                        .flat()
                        .join(', ') ||
                    'Invalid quantity';
                toast.error(message);
            } else {
                toast.error('Failed to update quantity');
            }

            setQuantities((prev) => ({
                ...prev,
                [item.id]:
                    cart.items.find((i) => i.id === item.id)?.quantity || 1,
            }));
        }
    };

    const debouncedUpdateQuantity = debounce(updateQuantity, 500);

    const handleInputChange = (
        item: CartItem,
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        setQuantities((prev) => ({ ...prev, [item.id]: value }));
        debouncedUpdateQuantity(item, value);
    };

    const removeItem = async (item: CartItem) => {
        try {
            await axios.post('/cart/remove', {
                _method: 'DELETE',
                item_id: item.id,
            });

            setCart((prev) => ({
                ...prev,
                items: prev.items.filter((i) => i.id !== item.id),
            }));

            setQuantities((prev) => {
                const newQuantities = { ...prev };
                delete newQuantities[item.id];
                return newQuantities;
            });

            toast.success(`${item.product.name} removed from cart`);
        } catch (error) {
            console.error('Failed to remove cart item', error);
            toast.error('Failed to remove item');
        }
    };

    const subtotal = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0,
    );
    const taxRate = 0.05;
    const shipping = 10.0;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount + shipping;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cart" />
            <Toaster position="top-right" />
            <div className="flex flex-col gap-6 p-4 md:flex-row md:items-start md:gap-8">
                <div className="flex-1 space-y-6">
                    {cart.items.length === 0 ? (
                        <p className="text-center text-lg text-gray-500">
                            Your cart is empty.
                        </p>
                    ) : (
                        cart.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md md:flex-row md:items-center"
                            >
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        {item.product.name}
                                    </h2>
                                    <p className="text-gray-600">
                                        Price: ${item.product.price.toFixed(2)}
                                    </p>
                                    <p className="text-gray-400">
                                        Subtotal: $
                                        {(
                                            item.product.price * item.quantity
                                        ).toFixed(2)}
                                    </p>
                                </div>

                                <div className="mt-2 flex items-center gap-2 md:mt-0">
                                    <input
                                        type="number"
                                        min={1}
                                        className="w-20 rounded border px-2 py-1 text-center text-gray-800"
                                        value={quantities[item.id]}
                                        onChange={(e) =>
                                            handleInputChange(item, e)
                                        }
                                    />
                                    <button
                                        onClick={() => removeItem(item)}
                                        className="rounded bg-red-600 p-2 text-white transition hover:bg-red-700"
                                        title="Remove Item"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Order Summary */}
                {cart.items.length > 0 && (
                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md md:mt-0 md:w-1/3 md:self-start">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            Order Summary
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (5%)</span>
                                <span>${taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2" />
                            <div className="flex justify-between text-xl font-bold text-gray-800">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button className="mt-4 w-full rounded bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700">
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
