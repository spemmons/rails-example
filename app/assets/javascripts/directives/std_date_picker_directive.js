app.directive('stdDatePicker', function() {
  return {
    templateUrl: 'directives/std_date_picker.html',
    scope: {
      date: '=date',
      options: '=disabled'
    }
  };
});
