
angular.module('myApp.view1', ['ngRoute', "leaflet-directive", ])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'Controller2'
  });
}])

.controller("Controller2", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
  $scope.selected = [];
  $scope.loaded =false;
  $scope.first=true;
  $scope.limitOptions = [5, 10, 15];
  $scope.selectedPolluntants = [
    { 
      name: '',
      valoreLimite:''
    }
  ];
 
  $scope.province = [
    {
        "name":'Bari',
        "sigla":'BA',
    },
    {
      "name":'Barletta-Andria-Trani',
      "sigla":'BT',
    },
    {
      "name":'Brindisi',
      "sigla":'BR',
    },
    {
      "name":'Foggia',
      "sigla":'FG',
    },
    {
      "name":'Lecce',
      "sigla":'LE',
    },
    {
      "name":'Taranto',
      "sigla":'TA',
    },
  ]
  
  //definizione dataset - senza ci sono problemi di aggiornamento dei charts
  $scope.dataset1_bar_chart1 = []
  $scope.dataset2_bar_chart1 = []
  $scope.dataset3_bar_chart1 = []
  $scope.dataset4_bar_chart1 = []
     
  $scope.dataset1_line_chart1 = []
  $scope.dataset2_line_chart1 = []
  $scope.dataset3_line_chart1 = []
  $scope.dataset4_line_chart1 = []

  $scope.dataset1_bar_chart2 = []
  $scope.dataset2_bar_chart2 = []
  $scope.dataset3_bar_chart2 = []
  $scope.dataset4_bar_chart2 = []
   
  $scope.dataset1_line_chart2 = []
  $scope.dataset2_line_chart2 = []
  $scope.dataset3_line_chart2 = []
  $scope.dataset4_line_chart2 = []

  $scope.dataset_radar = []
  $scope.dataset2_radar = []

//INIZIALIZZAZIONE DEI CHARTS
  $scope.bar_chart1= new Chart('bar_chart1');
  $scope.bar_chart2= new Chart('bar_chart2');
  $scope.line_chart1= new Chart('line_chart1');
  $scope.line_chart2= new Chart('line_chart2');
  $scope.radar_chart_pollution= new Chart('radar_chart_pollution');
  $scope.radar_chart_mortality= new Chart('radar_chart_mortality');

  $scope.dati_provincia = 
  {
      "anno":'',
      "provincia":'',
      "sigla":'',
      "valoreLimite":'',
      "valore_medio":'',
      "valore_max":'',
      "valore_min":'',
      "valore_pond_max_min":'',
      "valore_pond":'',
    }
    $scope.dati_inquinamento = 
    {
        "anno":'',
        "provincia":'',
        "sigla":'',
        "valoreLimite":'',
        "valore_medio":'',
        "valore_max":'',
        "valore_min":'',
        "valore_pond_max_min":'',
        "valore_pond":'',
      }
  
  $scope.mortalita= [
    {
      mortalita:'',
      tasso_mortalita:'',
      popolazione:'',
      provincia:'',
      
    }
  ];
 
  
  $scope.loadData = async function () {       
    $scope.loaded = false;
   
    var config = {
     headers : {'Accept' : 'application/json'}
    };
    console.log($scope.dataset_bar_char,$scope.dataset2_bar_char)
    console.log("Waiting...")
    if($scope.first) {
      $scope.selectedProvincia = $scope.province[4]
      await $http.get("http://localhost:3000/inquinante/getAll", config).then(async function(response) {
         
            console.log("RESPONSE DATA",response.data);
            $scope.polluntants = (response.data);
        
            $scope.selectedPolluntants = $scope.polluntants[2];
           
          }, async function(response) {
                    console.log("error")
                    
      });
     
      
      $scope.first = false
    
   
   
  } 
  var str = JSON.stringify($scope.selectedPolluntants.name);
  str = "["+str+"]"
 
  
 console.log(str, $scope.selectedProvincia)

  await $http.post("http://localhost:3000/rilevazione/province/2018/"+$scope.selectedProvincia, str, config).then(async function(response) {
        //Con questa get preleva le misurazioni dell'ultimo anno della provincia selezionata
        console.log("response", response.data.length)
        $scope.actual_pollution = (response.data[0]);
        console.log($scope.actual_pollution);

    }, async function(response) {
      console.log("error")
      $scope.loaded = false;
    });           
     
      await $http.get("http://localhost:3000/mortalita/all-years/"+$scope.selectedProvincia.sigla+"/getAll", config).then(async function(response) {
          //Con questa get preleva le mortalita per ogni anno
        console.log("response", response.data)
        $scope.dati_mortalita = (response.data);
        $scope.actual_mortality = (response.data[response.data.length-1]);
        var y=0;
        for(y in $scope.dati_mortalita )
        {
          $scope.dataset1_bar_chart2[y] = $scope.dati_mortalita[y].mortalita;
          $scope.dataset2_bar_chart2[y] = $scope.dati_mortalita[y].tasso_mortalita;

        }
        $scope.bar_chart2.destroy();
        $scope.bar_chart2 = new Chart('bar_chart2', {
          type: 'bar',
          data: {
            labels: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'],
            datasets: [
              
              {
                data: $scope.dataset1_bar_chart2,
                label: 'Mortality',
                backgroundColor: '#ff7417'
              }
            ]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      
        $scope.line_chart2.destroy();
        $scope.line_chart2 = new Chart('line_chart2', {
          type: 'line',
          data: {
            labels: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'],
            datasets: [
              {
                data: $scope.dataset2_bar_chart2,
                label: 'Mortality rate',
                backgroundColor: '#ff7417',
                borderColor: '#ff7417',
                borderWidth: 2,
                fill: false,
              },
             
            ]
          },
          
        });
        console.log($scope.bar_chart2.data.datasets)

      }, async function(response) {
      console.log("error")
      $scope.loaded = false;
      });   
      

      await $http.post("http://localhost:3000/rilevazione/all-years/"+$scope.selectedProvincia.sigla+"/getAll", str, config).then(async function(response) {
         
        console.log("response", response.data)
        $scope.dati_inquinamento = (response.data);
        $scope.actual_pollution = (response.data[response.data.length-1]);
        var y=0;
        
        for(y in $scope.dati_inquinamento )
        {
          $scope.dataset1_bar_chart1[y] = $scope.dati_inquinamento[y].valore_pond_max_min;
          $scope.dataset2_bar_chart1[y] = ($scope.dati_inquinamento[y].valore_min+$scope.dati_inquinamento[y].valore_medio)/2;
          $scope.dataset3_bar_chart1[y] = $scope.dati_inquinamento[y].valore_max;
          $scope.dataset4_bar_chart1[y] = $scope.dati_inquinamento[y].valoreLimite;
          
          $scope.dataset1_line_chart1[y] = $scope.dati_inquinamento[y].valore_pond_max_min;
          $scope.dataset2_line_chart1[y] = ($scope.dati_inquinamento[y].valore_min+$scope.dati_inquinamento[y].valore_medio)/2;
          $scope.dataset3_line_chart1[y] = $scope.dati_inquinamento[y].valore_max;
          $scope.dataset4_line_chart1[y] = $scope.dati_inquinamento[y].valoreLimite;
       

        }
        $scope.bar_chart1.destroy();
        $scope.bar_chart1 = new Chart('bar_chart1', {
          type: 'bar',
          data: {
            labels: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'],
            datasets: [
              {
                type: 'line',
                borderColor: 'red',
                borderWidth: 2,
                fill: false,
                data: $scope.dataset4_bar_chart1,
                label: 'Dangerous value',
                backgroundColor: 'red'
                
              },
              {
                data: $scope.dataset2_bar_chart1,
                label: 'Min value',
                backgroundColor: 'cyan'
              },
              {
                data: $scope.dataset1_bar_chart1,
                label: 'Mean value',
                backgroundColor: '#1783ff'
              },
              {
                data: $scope.dataset3_bar_chart1,
                label: 'Max value',
                backgroundColor: 'purple'
              }
            ]
          },
          options: {
           
            scales: {
              xAxes: [{
               // stacked: true,
              }],
              yAxes: [{
               // stacked: true,
                ticks: {
                    beginAtZero: true
                  }
                }]
            }
          }
        });
        $scope.line_chart1.destroy();
        $scope.line_chart1 = new Chart('line_chart1', {
          type: 'line',
          data: {
            labels: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'],
            datasets: [
              {
                type: 'line',
                borderColor: 'red',
                borderWidth: 2,
                fill: false,
                data: $scope.dataset4_line_chart1,
                label: 'Dangerous value',
                backgroundColor: 'red'
                
              },
              {
                data: $scope.dataset2_line_chart1,
                label: 'Min value',
                backgroundColor: 'cyan'
              },
              {
                data: $scope.dataset1_line_chart1,
                label: 'Mean value',
                backgroundColor: '#1783ff'
              },
              {
                data: $scope.dataset3_line_chart1,
                label: 'Max value',
                backgroundColor: 'purple'
              }
            ]
          
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
        
      }, async function(response) {
      console.log("error")
      $scope.loaded = false;
      });   
     
      await $http.post("http://localhost:3000/rilevazione/province/2018", str, config).then(async function(response) {
          $scope.dati_province = (response.data);
          console.log("DATI PROVINCE", response.data);
          
          var i=0;
          for(i in $scope.dati_province )
          {
            console.log("BEFORE IF", $scope.dati_province[i].provincia, $scope.selectedProvincia.sigla)
            if($scope.dati_province[i].provincia==$scope.selectedProvincia.sigla)
            {
              console.log("trovatooooooooooo", $scope.dati_province[i].provincia, $scope.selectedProvincia.sigla)
              $scope.actual_pollution = $scope.dati_province[i];

            }
            $scope.dataset2_radar[i] = $scope.dati_province[i].valore_pond_max_min;
           
          } 
          $scope.radar_chart_pollution.destroy();
          $scope.radar_chart_pollution = new Chart('radar_chart_pollution', {
                type: 'radar',
                data: {
                  labels: ['Bari', 'Brindisi', 'BAT', 'Foggia', 'Lecce', 'Taranto'],
                  datasets: [
                    {
                   
                      fillColor: '#1783ff',
                      borderColor: '#1783ff',
                      borderWidth: 2,
                      fill: true,
                      lineTension: 0,
                      data: $scope.dataset2_radar,
                      label: 'Pollution PM10',
                      //backgroundColor: '#1783ff'
                     
                    }
                  ]
                },
                options: {
                  tooltips: {
                    callbacks: {
                      label: function(tooltipItem, data) {
                        return data.datasets[tooltipItem.datasetIndex].label + ": " + tooltipItem.yLabel;
                      }
                    }
                  }
                }
          });
      }, async function(response) {
        console.log("error")
        $scope.loaded = false;


      });
      //l'azzeramento dei dataset risolve vari bug di aggiornamento dei chart!!!
      $scope.dataset_bar_char=[];
      $scope.dataset2_bar_char=[];
      $scope.dataset3_bar_char=[];
      $scope.dataset4_bar_char=[];
      $scope.dataset_radar=[];
      $scope.dataset2_radar=[];

      await $http.get("http://localhost:3000/mortalita/2018", config).then(async function(response) {
          $scope.dati_mortalita = (response.data);
          console.log($scope.dati_mortalita);
          
          var y=0;
          
          for(y in $scope.dati_mortalita )
          {
            $scope.dataset_radar[y] = $scope.dati_mortalita[y].tasso_mortalita;
          } 
          $scope.radar_chart_mortality.destroy();
          $scope.radar_chart_mortality = new Chart('radar_chart_mortality', {
                type: 'radar',
                data: {
                  labels: ['Bari', 'Brindisi', 'BAT', 'Foggia', 'Lecce', 'Taranto'],
                  datasets: [
                    {
                   
                      borderColor: '#ff7417',
                      fillColor: '#ff7417',
                      fill: true,
                      label: 'Mortality Rate',
                      lineTension: 0,
                      data: $scope.dataset_radar,
                    }
                  ]
                },
                options: {
                  tooltips: {
                    callbacks: {
                      label: function(tooltipItem, data) {
                        return data.datasets[tooltipItem.datasetIndex].label + ": " + tooltipItem.yLabel;
                      }
                    }
                  }
                }
          });
      }, async function(response) {
        console.log("error")
        $scope.loaded = false;

      });
$scope.loaded = true;
$scope.first = false
$scope.polluntantChanged, $scope.provinciaChanged = false
}

  angular.extend($scope, 
    {

    });

    $scope.$watch(

      function() {
        if($scope.provinciaChanged == true || $scope.polluntantChanged == true) {
         
           $scope.dataset1_bar_char1 = []
           $scope.dataset2_bar_char1 = []
           $scope.dataset3_bar_char1 = []
           $scope.dataset4_bar_char1 = []
           $scope.dataset_bar_char2 = [] 

           $scope.dataset1_line_char1 = []
           $scope.dataset2_line_char1 = []
           $scope.dataset3_line_char1 = []
           $scope.dataset4_line_char1 = []
           $scope.dataset_line_char2 = [] 
         
           $scope.dataset_radar = []
           $scope.dataset2_radar = []
         
           $scope.loadData()
         }
         $scope.provinciaChanged =  false
         $scope.polluntantChanged= false
      
      }
      
      );

  $scope.changePolluntants = function() {
    $scope.loadData()
    $scope.polluntantChanged = false
  };
  $scope.changeProvincia = function() {
    $scope.loadData()
     $scope.provinciaChanged = false
  };

}])

