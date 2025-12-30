<?php

namespace App\Mail;

use App\Models\Product;
use Illuminate\Mail\Mailable;

class LowStockMail extends Mailable
{
    public function __construct(
        public Product $product
    ) {}

    public function build()
    {
        return $this->subject('Low Stock Alert')
            ->view('emails.low-stock');
    }
}
