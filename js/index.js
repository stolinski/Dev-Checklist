var launch = angular.module('launch', ['ngStorage']);

launch.filter('breakFilter', function() {
  return function(text) {
     return text.replace(/ /g, '_') ; 
  };
});

launch.filter('objectByKeyValFilter', function () {
return function (input, filterKey, filterVal) {
    var filteredInput ={};
     angular.forEach(input, function(value, key){
       if(value[filterKey] && value[filterKey] !== filterVal){
          filteredInput[key]= value;
        }
     });
     return filteredInput;
  };
});

launch.factory('itemFactory', function() {
  var factory = {};
  var todos = {
    'ITS': {
      type:'ITS', 
      items:[
        {text: 'Database Request', done:false, info:'http://services.it.umich.edu/midatabase'},
        {text: 'Access Permissions', done:false}
      ], 
      show:true
    }, 
    'Drupal': {
      type:'Drupal', 
      items:[
        {text: 'Load PHP Modules', done:false},
        {text: 'Caching On', done:false},
        {text: 'Advacned Agg', done:false},         
        {text: 'Cache View', done:false}
      ], 
      show:false
    }, 
    'WordPress': {
      type:'WordPress', 
      items:[
        {text: 'Load PHP Modules', done:false},
        {text: 'SFTP Update Plugin', done:false}
      ], 
      show:false
    }, 
    'Mobile': {
      type:'Mobile', 
      items:[
        {text: 'Viewport Meta Tag', done:false},
        {text: 'HTML5 Input Types', done:false, info:'http://html5tutorial.info/html5-contact.php'},
        {text:'Small Phone (iPhone)', done:false},         
        {text: 'Large Phone (Galaxy S#)', done:false},
        {text: '7" Tablet', done:false},
        {text: '10" Tablet', done:false}
      ], 
      show:true
    }, 
    'Usability' : {
      type:'Usability', 
      items:[
        {text:'404 Page', done:false},         
        {text: 'Favicon', done:false},
        {text: 'User Freindly URLs', done:false},
        {text: 'Print Styles', done:false}], 
      show:true
    },
    'SE0': {
      type:'SE0', 
      items:[
        {text:'Robots.txt', done:false, info:'http://tools.seobook.com/robots-txt/'},         
        {text: 'sitemap.xml', done:false},
        {text: 'Crafted Page Titles', done:false}
      ], 
      show:true
    }, 
    'Social Media' : {
      type:'Social Media', 
      items:[
        {text:'Twitter Cards', done:false},         
        {text: 'Facebook Insights', done:false},
        {text: 'Open Graph protocol', done:false}
      ], 
      show:true
    },
    'Performance': {
      type:'Performance', 
      items:[
        {text:'Y-Slow Score 85+', done:false},
        {text:'Optimize Images', done:false}
      ], 
      show:true
    },
    'Accessibility': {
      type:'Accessibility', 
      items:[
        {text:'ARIA Landmarks', done:false},         
        {text: 'Accessibility validation', done:false}
      ],
      show:true
    }, 
    'CodeQuality': {
      type:'Code Quality', 
      items:[
        {text:'JSLint/JSHint', done:false},         
        {text: 'Semantic HTML', done:false}
      ], 
      show:true
    }, 
    'Analytics': {
      type: "Analytics",
      items: [
        {text:'Google Analytics', done:false},         
        {text: 'Uptime Monitor', done:false}
      ], 
      show:true 
    },
    'Finalizing': {
      type: 'Finalizing', 
      items:[
        {text:'Check For Broken Links', done:false},         
        {text: 'Redirect off www', done:false}
      ],
      show:true 
    }
  };

  factory.getItems = function() {
    return todos;
  };

  return factory;
});
  /*
  $scope.addTodo = function () {
    $scope.todos.push({text:$scope.formTodoText, done:false});
    $scope.formTodoText = '';
  };*/
  

launch.controller('LaunchController', function( $scope, itemFactory, $localStorage) {

  $scope.todos = itemFactory.getItems();
  $temp = itemFactory.getItems();
  $scope.$storage = $localStorage.$default($temp);

  $scope.getLeftTodos = function () {
    var $leftTodos = 0;
    var $shown = $scope.getShown();

    _.each($shown, function(group) {
      var $tempTotes = _.filter(group.items, function(todo){
          return !todo.done;
      });
    $leftTodos += $tempTotes.length;
    });
    return $leftTodos;
  };


  // Gets 0-100 % value of todos
  $scope.getPercentTodos = function () {
    // Gets Todos Not Checked
    var $leftTodos = $scope.getLeftTodos();
    var $totalTodos = 0;

    // Gets All Shown Todos
    var $shown = $scope.getShown();

    // Finds the length of each list of todos and adds them together for the total todo items.
    _.each($shown, function(item) {
      $totalTodos += item.items.length;
    });

    // Returns 0-100 value for progress input 
    return (1 - ($leftTodos/$totalTodos)) * 100;
  };  


  // Returns Todo items that are shown on screen.
  $scope.getShown = function() {
    var $shown = _.filter($scope.$storage, function(group) {
      return group.show;
    });
    return $shown;
  }

  $scope.addList = function (filter) {
    $list = _.find($scope.$storage, function(item) {
      return item.type === filter;
    });
    if ($list.show === true) {
      $list.show = false;
    } else {
      $list.show = true;
    }
  };



  $scope.clearData = function () {
    $localStorage.$reset(itemFactory.getItems());
  };

});


launch.directive("masonry", function () {
    var NGREPEAT_SOURCE_RE = '<!-- ngRepeat: ((.*) in ((.*?)( track by (.*))?)) -->';
    return {
        compile: function(element, attrs) {
            // auto add animation to brick element
            var animation = attrs.ngAnimate || "'masonry'";
            var $brick = element.children();
            $brick.attr("ng-animate", animation);
            
            // generate item selector (exclude leaving items)
            var type = $brick.prop('tagName');
            var itemSelector = type+":not([class$='-leave-active'])";
            
            return function (scope, element, attrs) {
                var options = angular.extend({
                    itemSelector: itemSelector
                }, scope.$eval(attrs.masonry));
                
                // try to infer model from ngRepeat
                if (!options.model) { 
                    var ngRepeatMatch = element.html().match(NGREPEAT_SOURCE_RE);
                    if (ngRepeatMatch) {
                        options.model = ngRepeatMatch[4];
                    }
                }
                
                // initial animation
                element.addClass('masonry');
                
                // Wait inside directives to render
                setTimeout(function () {
                    element.masonry(options);
                    
                    element.on("$destroy", function () {
                        element.masonry('destroy');
                    });
                    
                    if (options.model) {
                        scope.$apply(function() {
                            scope.$watchCollection(options.model, function (_new, _old) {
                                if(_new == _old) return;
                                
                                // Wait inside directives to render
                                setTimeout(function () {
                                    element.masonry("reload");
                                });
                            });
                        });
                    }
                });
            };
        }
    };
});

$('.settings-trigger').on('click', function() {
  $('.settings').toggleClass('open');
});

$('.add-btn').on('click', function() {
  $(this).toggleClass('active');
});