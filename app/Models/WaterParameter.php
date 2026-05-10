<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\WaterTest;

class WaterParameter extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'unit',
        'min_value',
        'max_value',
        'type',
    ];

    public function waterTests(): HasMany
    {
        return $this->hasMany(WaterTest::class);
    }
}
