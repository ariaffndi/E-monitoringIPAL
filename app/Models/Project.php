<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'name',
        'location',
        'type',
        'capacity',
        'image',
    ];

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    public function waterParameters()
    {
        return $this->hasMany(WaterParameter::class);
    }

    public function reports()
    {
        return $this->hasMany(OperationalReport::class);
    }

    public function operators()
    {
        return $this->hasMany(User::class);
    }
}