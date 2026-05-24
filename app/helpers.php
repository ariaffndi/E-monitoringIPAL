<?php

use App\Models\Project;

if (! function_exists('currentProject')) {

   function currentProject()
   {
      $projectId = session('selected_project_id');

      if (! $projectId) {
            return null;
      }

      return Project::find($projectId);
   }
}