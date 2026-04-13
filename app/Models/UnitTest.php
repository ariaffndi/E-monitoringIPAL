<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitTest extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'operational_report_id',
        'unit_id',
        'condition',
        'test_image'
    ];

    public function operationalReport()
    {
        return $this->belongsTo(OperationalReport::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
