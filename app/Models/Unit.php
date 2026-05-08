<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'specification',
        'dimension',
        'description',
        'image',
    ];

        public function unitTests()
    {
        return $this->hasMany(UnitTest::class);
    }

    public function latestTest()
    {
        return $this->hasOne(UnitTest::class)->latestOfMany();
    }
}
