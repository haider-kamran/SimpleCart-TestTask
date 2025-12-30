import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Product } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

type PaginatedProducts = {
    data: Product[];
    current_page: number;
    last_page: number;
};

type Props = {
    products: PaginatedProducts;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Products', href: '' },
];

export default function ProductsIndex() {
    const { products: initialProducts } = usePage<Props>().props;

    const [products, setProducts] = useState<Product[]>(initialProducts.data);
    const [page, setPage] = useState(initialProducts.current_page);
    const [lastPage, setLastPage] = useState(initialProducts.last_page);
    const [loading, setLoading] = useState(false);

    // Load a specific page
    const loadPage = async (nextPage: number) => {
        if (nextPage < 1 || nextPage > lastPage) return;

        setLoading(true);
        try {
            const response = await axios.get('/products', {
                params: { page: nextPage },
            });
            const paginated: PaginatedProducts = response.data.products;

            setProducts(paginated.data);
            setPage(paginated.current_page);
            setLastPage(paginated.last_page);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    // Add product to cart
    const addToCart = async (productId: number) => {
        try {
            await axios.post('/cart/add', { product_id: productId });
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === productId
                        ? { ...p, stock_quantity: p.stock_quantity - 1 }
                        : p,
                ),
            );
            toast.success('Product added to cart!');
        } catch (error) {
            toast.error('Failed to add product to cart');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Toaster position="top-right" />
            <Head title="Products" />

            <div className="flex flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    {products.length > 0
                        ? products.map((product) => (
                              <div
                                  key={product.id}
                                  className="flex flex-col justify-between rounded-xl border p-4 hover:shadow-lg"
                              >
                                  <div className="flex items-center justify-between">
                                      <h2 className="font-bold">
                                          {product.name}
                                      </h2>
                                      <button
                                          onClick={() => addToCart(product.id)}
                                          disabled={product.stock_quantity <= 0}
                                          className="rounded-full bg-blue-600 p-2 text-white disabled:opacity-50"
                                      >
                                          <ShoppingCart className="h-5 w-5" />
                                      </button>
                                  </div>
                                  <p>Price: ${product.price}</p>
                                  <p>Stock: {product.stock_quantity}</p>
                              </div>
                          ))
                        : Array.from({ length: 3 }).map((_, i) => (
                              <div
                                  key={i}
                                  className="relative aspect-video rounded-xl border"
                              >
                                  <PlaceholderPattern className="absolute inset-0" />
                              </div>
                          ))}
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-center gap-4">
                    <button
                        disabled={page <= 1 || loading}
                        onClick={() => loadPage(page - 1)}
                        className="rounded border px-3 py-1 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span>
                        Page {page} of {lastPage}
                    </span>
                    <button
                        disabled={page >= lastPage || loading}
                        onClick={() => loadPage(page + 1)}
                        className="rounded border px-3 py-1 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
