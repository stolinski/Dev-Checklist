var launch = angular.module('launch', []);

launch.filter('breakFilter', function() {
  return function(text) {
     return text.replace(/ /g, '_') ; 
  };
});

launch.factory('itemFactory', function() {
  var factory = {};
  var todos = [
    {type:'Mobile', items:[
      {text:'Small Phone (iPhone)', done:false},         
      {text: 'Large Phone (Galaxy S#)', done:false},
      {text: '7" Tablet', done:false},
      {text: '10" Tablet', done:false}]
    }, {type:'Usability ', items:[
      {text:'404 Page', done:false},         
      {text: 'Favicon', done:false},
      {text: 'User Freindly URLs', done:false},
      {text: 'Print Styles', done:false}]
    },{type:'SE0 ', items:[
      {text:'Robots.txt', done:false},         
      {text: 'sitemap.xml', done:false},
      {text: 'Crafted Page Titles', done:false}]
    }, {type:'Social Media ', items:[
      {text:'Twitter Cards', done:false},         
      {text: 'Facebook Insights', done:false},
      {text: 'Open Graph protocol', done:false}]
    },{type:'Performance', items:[
      {text:'Y-Slow Score 85+', done:false},         
      {text: 'Large Phone (Galaxy S#)', done:false}]
    },{type:'Accessibility', items:[
      {text:'ARIA Landmarks', done:false},         
      {text: 'Accessibility validation', done:false}]
    }, {type:'Code Quality', items:[
      {text:'JSLint/JSHint', done:false},         
      {text: 'Semantic HTML', done:false}]
    }, {type:'Analytics', items:[
      {text:'Google Analytics', done:false},         
      {text: 'Uptime Monitor', done:false}]
    }, {type:'Finalizing', items:[
    {text:'Check For Broken Links', done:false},         
    {text: 'Redirect off www', done:false}]
    }
  ];

  factory.getItems = function() {
    return todos;
  };

  return factory;
});
  /*
  $scope.addTodo = function () {
    $scope.todos.push({text:$scope.formTodoText, done:false});
    $scope.formTodoText = '';
  };
  
    $scope.clearCompleted = function () {
        $scope.todos = _.filter($scope.todos, function(todo){
            return !todo.done;
        });
    };*/
launch.controller('LaunchController', function( $scope, itemFactory) {
  $scope.todos = itemFactory.getItems();

  $scope.getLeftTodos = function () {
    var $totalTodos = 0;
    
    _.each($scope.todos, function(group) {
      var $tempTotes = _.filter(group.items, function(todo){
          return !todo.done;
      });
    $totalTodos += $tempTotes.length;
    });
    return $totalTodos;
  };
  
    
  $scope.getPercentTodos = function () {
    
    var $leftTodos = 0;
    _.each($scope.todos, function(group) {
      var $tempTotes = _.filter(group.items, function(todo){
          return !todo.done;
      });
    $leftTodos += $tempTotes.length;
    });
    
    var $totalTodos = 0;
    _.each($scope.todos, function(group) {
      var $tempTotes = group.items; 
      $totalTodos += $tempTotes.length;
    });
    return (1 - ($leftTodos/$totalTodos)) * 100;
  };  
});

document.addEventListener('DOMContentLoaded',function(){
  var container = document.querySelector('.items-wrapper');
  var msnry = new Masonry( container, {
    // options
    itemSelector: '.list'
  });

  var d = document.getElementById("div1");
  d.className = d.className + " otherclass";


});