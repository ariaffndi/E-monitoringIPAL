<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class WaterTest extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'operational_report_id',
        'water_parameter_id',
        'location',
        'value',
    ];

    public function operationalReport()
    {
        return $this->belongsTo(OperationalReport::class);
    }
    
    public function waterParameter()
    {
        return $this->belongsTo(WaterParameter::class);
    }

}
