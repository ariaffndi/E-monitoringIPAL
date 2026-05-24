<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

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

    public function unitTests(): HasMany
    {
        return $this->hasMany(UnitTest::class);
    }

    public function latestTest(): HasOne
    {
        return $this->hasOne(UnitTest::class)->latestOfMany();
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
