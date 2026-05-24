<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\UnitTest;
use App\Models\WaterTest;

use Illuminate\Database\Eloquent\SoftDeletes;

class OperationalReport extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'note',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function unitTests()
    {
        return $this->hasMany(UnitTest::class);
    }

    public function waterTests()
    {
        return $this->hasMany(WaterTest::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

}
