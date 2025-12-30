<?php

namespace App\Jobs;

use App\Mail\DailySalesReportMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class DailySalesReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $sales = DB::table('cart_items')
            ->join('products', 'products.id', '=', 'cart_items.product_id')
            ->whereDate('cart_items.created_at', today())
            ->select(
                'products.name',
                DB::raw('SUM(cart_items.quantity) as total_quantity'),
                DB::raw('SUM(cart_items.quantity * products.price) as total_amount')
            )
            ->groupBy('products.name')
            ->get();

        Mail::to('admin@example.com')->send(
            new DailySalesReportMail($sales)
        );
    }
}
