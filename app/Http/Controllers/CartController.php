<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Repositories\CartRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = CartRepository::userCart(Auth::user())
            ->load('items.product');

        return Inertia::render('Cart/Index', [
            'cart' => $cart,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $cart = CartRepository::userCart(Auth::user());
        CartRepository::addItem($cart, $request->product_id);

        return back();
    }

    public function update(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:cart_items,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $item = CartItem::findOrFail($request->item_id);
        $product = $item->product;

        if ($request->quantity > $product->stock_quantity) {
            if ($request->wantsJson()) {
                return response()->json([
                    'error' => 'Requested quantity exceeds available stock.',
                    'available' => $product->stock_quantity,
                ], 422);
            }

            return back()->withErrors([
                'quantity' => 'Requested quantity exceeds available stock.',
            ]);
        }

        CartRepository::updateItem($item, $request->quantity);
        return $request->wantsJson()
            ? response()->json(['success' => true])
            : back()->with('success', 'Cart updated successfully!');
    }


    public function remove(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:cart_items,id',
        ]);

        $item = CartItem::findOrFail($request->item_id);
        CartRepository::removeItem($item);

        return back();
    }
}
