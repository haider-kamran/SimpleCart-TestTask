<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Repositories\ProductRepository;
use Inertia\Inertia;

class ProductController extends Controller
{

    public function __construct(
        protected ProductRepository $products
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $paginated = $this->products->paginate(10);

        if (request()->wantsJson()) {
            return response()->json([
                'products' => $paginated,
            ]);
        }

        return Inertia::render('Products/Index', [
            'products' => $paginated,
        ]);
    }

}
