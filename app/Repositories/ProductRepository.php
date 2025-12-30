<?php
namespace App\Repositories;

use App\Jobs\LowStockNotificationJob;
use App\Models\Product;

class ProductRepository extends BaseRepository
{
    public function model()
    {
        return Product::class;
    }

    public function fetchGetData()
    {
        return $this->model->orderBy('id', 'desc');
    }

    public function fetchDecrementStock(Product $product, int $quantity): void
    {
        $product->decrement('stock_quantity', $quantity);

        if ($product->stock_quantity <= 5) {
            LowStockNotificationJob::dispatch($product);
        }
    }
}
