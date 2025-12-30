<h2>Daily Sales Report</h2>

@if ($sales->isEmpty())
    <p>No sales today.</p>
@else
    <table border="1" cellpadding="6">
        <tr>
            <th>Product</th>
            <th>Quantity Sold</th>
            <th>Total Amount</th>
        </tr>

        @foreach ($sales as $sale)
            <tr>
                <td>{{ $sale->name }}</td>
                <td>{{ $sale->total_quantity }}</td>
                <td>${{ number_format($sale->total_amount, 2) }}</td>
            </tr>
        @endforeach
    </table>
@endif
