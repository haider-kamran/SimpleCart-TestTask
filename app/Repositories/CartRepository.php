<?php

namespace App\Repositories;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\User;

class CartRepository extends BaseRepository
{
    public function model()
    {
        return Cart::class;
    }

    /**
     * Get or create cart for authenticated user
     */
    public function fetchUserCart(User $user): Cart
    {
        return $this->model->firstOrCreate([
            'user_id' => $user->id,
        ]);
    }

    /**
     * Add product to cart
     */
    public function fetchAddItem(Cart $cart, int $productId): CartItem
    {
        return $cart->items()->firstOrCreate(
            ['product_id' => $productId],
            ['quantity' => 1]
        );
    }

    /**
     * Update quantity
     */
    public function fetchUpdateItem(CartItem $item, int $quantity): void
    {
        $item->update(['quantity' => $quantity]);
    }

    /**
     * Remove item
     */
    public function fetchRemoveItem(CartItem $item): void
    {
        $item->delete();
    }
}
