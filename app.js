var app = angular.module('dit-calculator', []);

app.controller('mainController', ['$scope', function($scope) {

  $scope.salary = {
    grossYear: 36000,
    grossMonth: 3000,
    netYear: 19200,
    netMonth: 1600,
    taxRate: 42,
    ruling: false,
    age: false
  }

  $scope.$watch('salary.age', reCalculate);
  $scope.$watch('salary.ruling', reCalculate);
  $scope.$watch('salary.grossYear', reCalculate);

  function reCalculate() {
    grossYear = $scope.salary.grossYear || 0;
    $scope.salary.taxableYear = $scope.salary.ruling?grossYear * 0.7:grossYear;
    $scope.salary.generalCredit = getCredits(grossYear).lk;
    $scope.salary.labourCredit = getCredits(grossYear).ak;
    $scope.salary.grossMonth = ~~(grossYear / 12);
    $scope.salary.netYear = grossYear - getTaxAmount($scope.salary.taxableYear, $scope.salary.age);
    $scope.salary.netMonth = ~~($scope.salary.netYear / 12);
    $scope.salary.incomeTax = getTaxAmount($scope.salary.taxableYear, $scope.salary.age);
  }

  function getTaxAmount(grossYear, isRuling, age) {

		var taxableIncome = isRuling?grossYear*0.7:grossYear;
		//var taxCredits = getCredits(grossYear);

    var taxAmountPeriods = [
      19822, // 0 - 19,822
      13767, // 33,589 - 19,822
      23996, // 57,585 - 33,589
      Infinity
    ];

    var taxRates = [.365, .42, .42, .52];
    var taxRates64 = [0.1575, 0.235, .42, .52];

    if (age) {
      taxRates = taxRates64;
    }

    var taxAmount = 0;

    for (var i = 0; i < taxRates.length; i++) {

      if (taxableIncome - taxAmountPeriods[i] < 0) {
        taxAmount += taxableIncome * taxRates[i];
        break;
      } else {
        taxAmount += taxAmountPeriods[i] * taxRates[i];
        taxableIncome = taxableIncome - taxAmountPeriods[i];
      }
    }
    //return taxAmount - taxCredits.lk - taxCredits.ak;
    return taxAmount;
  }

	function getCredits(salary){
		for(var index = 0; index < creditRates.length; index++){
			if(creditRates[index].salary > salary){
				break;
			}
		}
		return index?creditRates[index-1]:creditRates[0];
	}

}]);