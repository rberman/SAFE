angular.module('app.services', ['ngResource'])

.factory('Reports', function($resource){
  return $resource('https://safecarlhacks2016.herokuapp.com/reports.json', {},
  {'post':  {method:'POST', headers: {'Content-Type': 'application/json'}}
  }
  );
})

.factory('Comment', function($resource){
  return $resource('https://safecarlhacks2016.herokuapp.com/answers/', {},
    {'post':  {method:'POST', headers: {'Content-Type': 'application/json'}}
    }
  );
});

