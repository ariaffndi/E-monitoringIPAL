<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
}
