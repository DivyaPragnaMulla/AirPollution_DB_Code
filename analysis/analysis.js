var app = angular.module('myApp.analysis', ['ngRoute', 'ngMaterial', 'mdDataTable', 'ngMdIcons', 'ngSanitize', 'ngTable', 'angularjs-gauge' ]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/analysis', {
    css: 'analysis/analysis.css',
    templateUrl: 'analysis/analysis.html',
    controllers: ['Controller','ControllerBoD']
  });
}])
.controller("Controller", [ '$scope', '$http','NgTableParams', function($scope, $http, ngTableParams) {
 
  $scope.selectedYear = 2015;
  $scope.usersTable = new ngTableParams({ dataset: $scope.dati_airq });
  $scope.selectedAP="Mean";

  $scope.dati_airq = [
    {
      "provincia":"LE",
      "anno":2018,
      "media":0,
      "popolazione":0,
      "mortinaturali":0,
      "incidenza":0,
      "rr_mean":0,
      "rr_lower":0,
      "rr_upper":0,
      "AP_mean":0,
      "AP_lower":0,
      "AP_upper": 0,
      "BE_mean":0,
      "BE_lower":0,
      "BE_upper":0,
      "NE_mean":0,
      "NE_lower":0,
      "NE_upper":0,
      "BC_mean":0,
      "BC_lower":0,
      "BC_upper":0,
      "NC_mean":0,
      "NC_lower":0,
      "NC_upper":0,
    }
  ];

  $scope.value=[];

  $scope.datiGaficoAP={
    province:[],
    mortinaturali:[],
    AP_mean:[],
    AP_lower:[],
    AP_upper:[],
    BE_mean:[],
    BE_lower:[],
    BE_upper:[],
    rr_mean:[],
    rr_lower:[],
    rr_upper:[]
  }

  $scope.loadData = async function () {     
    $scope.loadedMortality = false;
   
    var config = {
      headers : {'Accept' : 'application/json'}
    };

    await $http.get("http://localhost:3000/airqplus/impact_assessment/tutteCauseNaturali/tutteleprovince/"+$scope.selectedYear, config)
    .then(async function(response) {
      $scope.dati_airq = (response.data);
      console.log($scope.dati_airq);
      for(var i = 0; i<$scope.dati_airq.length; i++){
        $scope.datiGaficoAP.province.push($scope.dati_airq[i].FKprovincia);
        $scope.datiGaficoAP.mortinaturali.push($scope.dati_airq[i].mortinaturali);
        $scope.datiGaficoAP.AP_mean.push($scope.dati_airq[i].AP_mean);
        $scope.datiGaficoAP.AP_lower.push($scope.dati_airq[i].AP_lower);
        $scope.datiGaficoAP.AP_upper.push($scope.dati_airq[i].AP_upper);
        $scope.datiGaficoAP.BE_mean.push($scope.dati_airq[i].BE_mean);
        $scope.datiGaficoAP.BE_lower.push($scope.dati_airq[i].BE_lower);
        $scope.datiGaficoAP.BE_upper.push($scope.dati_airq[i].BE_upper);
        $scope.datiGaficoAP.rr_mean.push($scope.dati_airq[i].rr_mean);
        $scope.datiGaficoAP.rr_lower.push($scope.dati_airq[i].rr_lower);
        $scope.datiGaficoAP.rr_upper.push($scope.dati_airq[i].rr_upper);
        $scope.value.push({
          valoremean:($scope.dati_airq[i].AP_mean*100).toFixed(1),
          valorelow:($scope.dati_airq[i].AP_lower*100).toFixed(1),
          valoreup:($scope.dati_airq[i].AP_upper*100).toFixed(1),
          provincia: $scope.dati_airq[i].FKprovincia
        });
      }
      console.log("dati grafico",$scope.datiGaficoAP);
      $scope.loadedMortality = true;
      $scope.bar_chart();
      $scope.line_chart();
    }, async function(error) {
      console.log("error",error);
      $scope.loadedMortality = false;
    });
  }//fine funzione loadData
  
  //funzione che aggiorna la sezione gauges
  $scope.aggiornaGauges=function(evt){
    console.log("evento click",evt.target.id);
    $scope.selectedAP=evt.target.id;
    console.log("selected",$scope.selectedAP);
  }

  $scope.line_chart=function drawLineChartRR(){

    new Chart(document.getElementById("line-chart"), {
      type: 'line',
      data: {
        labels: $scope.datiGaficoAP.province,
        datasets: [
          { 
            data: $scope.datiGaficoAP.rr_upper,
            label: "Rischio Relativo Upper",
            borderColor: "#3e95cd",
            fill: false
          }, { 
            data: $scope.datiGaficoAP.rr_lower,
            label: "Rischio Relativo Lower",
            borderColor: "#8e5ea2",
            fill: false
          }, { 
            data: $scope.datiGaficoAP.rr_mean,
            label: "Rischio Relativo Mean",
            borderColor: "#3cba9f",
            fill: false
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Rischio Relativo nelle diverse province'
        }
      }
    });
  }

  $scope.bar_chart=function drawBarChartNE(){
    
    new Chart(document.getElementById("bar_chart"), {
      type: 'bar',
      data: {
        labels: $scope.datiGaficoAP.province,
        datasets: [
          {
            label: 'Attributable Cases x100000 Upper',
            data: $scope.datiGaficoAP.BE_upper,
            backgroundColor: 'cyan'
          },
          {
            label: 'Attributable Cases x100000 Mean',
            data: $scope.datiGaficoAP.BE_mean,
            backgroundColor: 'purple'
          },
          {
            label: 'Attributable Cases x100000 Lower',
            data: $scope.datiGaficoAP.BE_lower,
            backgroundColor: '#1783ff'
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Estimated Number of Attributable Cases per 100.000 Population at risk'
        },
        scales:{
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
  $scope.setYear=function setYear(selectedYear){
    console.log("CHANGE!!");
    console.log("year",$scope.selectedYear);
    $scope.selectedYear=selectedYear;
    console.log("year2",$scope.selectedYear);

    $scope.selectedAP="Mean";
    $scope.dati_airq = [
      {
        "provincia":"LE",
        "anno":2018,
        "media":0,
        "popolazione":0,
        "mortinaturali":0,
        "incidenza":0,
        "rr_mean":0,
        "rr_lower":0,
        "rr_upper":0,
        "AP_mean":0,
        "AP_lower":0,
        "AP_upper": 0,
        "BE_mean":0,
        "BE_lower":0,
        "BE_upper":0,
        "NE_mean":0,
        "NE_lower":0,
        "NE_upper":0,
        "BC_mean":0,
        "BC_lower":0,
        "BC_upper":0,
        "NC_mean":0,
        "NC_lower":0,
        "NC_upper":0,
      }
    ];

    $scope.value=[];

    $scope.datiGaficoAP={
      province:[],
      mortinaturali:[],
      AP_mean:[],
      AP_lower:[],
      AP_upper:[],
      BE_mean:[],
      BE_lower:[],
      BE_upper:[],
      rr_mean:[],
      rr_lower:[],
      rr_upper:[]
    }
    
    var item = document.getElementById("bar_chart");
    item.parentNode.removeChild(item);
    var item = document.getElementById("line-chart");
    item.parentNode.removeChild(item);
    document.getElementById('barchart').innerHTML = '<canvas ngHide="loadedMortality" id="bar_chart" width="800" height="250"></canvas>';
    document.getElementById('linechart').innerHTML = '<canvas ngHide="loadedMortality" id="line-chart" width="800" height="250"></canvas>';

    $scope.loadData();
  }
}])//fine controller per l'Impact Assessment

//inizio controller burden
.controller("ControllerBoD",[ '$scope', '$http','NgTableParams', function($scope, $http, ngTableParams) {
  $scope.selectedYear = 2015;
  $scope.selectedoutcome = "LC";
  $scope.outcomes = [
    {
      nome:"Lung Cancer",
      sigla:"LC"
    },
    {
      nome:"Ischemic Heart Disease",
      sigla:"IHD"
    },
    {
      nome:"cerebrovascular disease",
      sigla:"STROKE"
    },
    {
      nome:"Chronic Obstructive Pulmonary Disease",
      sigla:"COPD"
    }
  ]

  $scope.usersTable = new ngTableParams({ dataset: $scope.dati_airq });

  $scope.selectedAP="Mean";

  $scope.dati_airq = [
    {
      "provincia":"LE",
      "anno":2018,
      "media":0,
      "popolazione":0,
      "morticausa":0,
      "incidenza":0,
      "fascia_eta":[0,120],
      "rr_mean":0,
      "rr_lower":0,
      "rr_upper":0,
      "AP_mean":0,
      "AP_lower":0,
      "AP_upper": 0,
      "BE_mean":0,
      "BE_lower":0,
      "BE_upper":0,
      "NE_mean":0,
      "NE_lower":0,
      "NE_upper":0,
      "BC_mean":0,
      "BC_lower":0,
      "BC_upper":0,
      "NC_mean":0,
      "NC_lower":0,
      "NC_upper":0,
    }
  ];

  $scope.value=[];

  $scope.datiGaficoAP={
    province:[],
    morticausa:[],
    AP_mean:[],
    AP_lower:[],
    AP_upper:[],
    BE_mean:[],
    BE_lower:[],
    BE_upper:[],
    rr_mean:[],
    rr_lower:[],
    rr_upper:[]
  }

  $scope.loadData = async function () {     
    $scope.loadedMortality = false;
   
    var config = {
      headers : {'Accept' : 'application/json'}
    };

    await $http.get("http://localhost:3000/airqplus/burden_of_disease/tutteleprovince/"+$scope.selectedYear+"/"+$scope.selectedoutcome, config)
    .then(async function(response) {
      $scope.dati_airq = (response.data);
      console.log($scope.dati_airq);
      for(var i = 0; i<$scope.dati_airq.length; i++){
        $scope.datiGaficoAP.province.push($scope.dati_airq[i].FKprovincia);
        $scope.datiGaficoAP.morticausa.push($scope.dati_airq[i].morticausa);
        $scope.datiGaficoAP.AP_mean.push($scope.dati_airq[i].AP_mean);
        $scope.datiGaficoAP.AP_lower.push($scope.dati_airq[i].AP_lower);
        $scope.datiGaficoAP.AP_upper.push($scope.dati_airq[i].AP_upper);
        $scope.datiGaficoAP.BE_mean.push($scope.dati_airq[i].BE_mean);
        $scope.datiGaficoAP.BE_lower.push($scope.dati_airq[i].BE_lower);
        $scope.datiGaficoAP.BE_upper.push($scope.dati_airq[i].BE_upper);
        $scope.datiGaficoAP.rr_mean.push($scope.dati_airq[i].rr_mean);
        $scope.datiGaficoAP.rr_lower.push($scope.dati_airq[i].rr_lower);
        $scope.datiGaficoAP.rr_upper.push($scope.dati_airq[i].rr_upper);
        $scope.value.push({
          valoremean:($scope.dati_airq[i].AP_mean*100).toFixed(1),
          valorelow:($scope.dati_airq[i].AP_lower*100).toFixed(1),
          valoreup:($scope.dati_airq[i].AP_upper*100).toFixed(1),
          provincia: $scope.dati_airq[i].FKprovincia
        });
      }
      console.log("dati grafico",$scope.datiGaficoAP);
      $scope.loadedMortality = true;
      drawBarChartNE();
      drawLineChartRR();
    }, async function(error) {
      console.log("error",error);
      $scope.loadedMortality = false;
    });
  }//fine funzione loadData
  
  //funzione che aggiorna la sezione gauges
  $scope.aggiornaGauges=function(evt){
    console.log("evento click",evt.target.id);
    $scope.selectedAP=evt.target.id;
    console.log("selected",$scope.selectedAP);
  }

  function drawBarChartNE(){
    
    new Chart(document.getElementById("bar_chart_BOD"), {
      type: 'bar',
      data: {
        labels: $scope.datiGaficoAP.province,
        datasets: [
          {
            label: 'Attributable Cases x100000 Upper',
            data: $scope.datiGaficoAP.BE_upper,
            backgroundColor: 'cyan'
          },
          {
            label: 'Attributable Cases x100000 Mean',
            data: $scope.datiGaficoAP.BE_mean,
            backgroundColor: 'purple'
          },
          {
            label: 'Attributable Cases x100000 Lower',
            data: $scope.datiGaficoAP.BE_lower,
            backgroundColor: '#1783ff'
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Estimated Number of Attributable Cases per 100.000 Population at risk'
        },
        scales:{
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
  function drawLineChartRR(){

    new Chart(document.getElementById("line_chart_BOD"), {
      type: 'line',
      data: {
        labels: $scope.datiGaficoAP.province,
        datasets: [
          { 
            data: $scope.datiGaficoAP.rr_upper,
            label: "Rischio Relativo Upper",
            borderColor: "#3e95cd",
            fill: false
          }, { 
            data: $scope.datiGaficoAP.rr_lower,
            label: "Rischio Relativo Lower",
            borderColor: "#8e5ea2",
            fill: false
          }, { 
            data: $scope.datiGaficoAP.rr_mean,
            label: "Rischio Relativo Mean",
            borderColor: "#3cba9f",
            fill: false
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Rischio Relativo nelle diverse province'
        }
      }
    });
  }
  $scope.setYear=function setYear(selectedYear){
    console.log("CHANGE!!");
    console.log("year",$scope.selectedYear);
    $scope.selectedYear=selectedYear;
    console.log("year2",$scope.selectedYear);

    $scope.selectedAP="Mean";
    $scope.dati_airq = [
      {
        "provincia":"LE",
      "anno":2018,
      "media":0,
      "popolazione":0,
      "morticausa":0,
      "incidenza":0,
      "fascia_eta":[0,120],
      "rr_mean":0,
      "rr_lower":0,
      "rr_upper":0,
      "AP_mean":0,
      "AP_lower":0,
      "AP_upper": 0,
      "BE_mean":0,
      "BE_lower":0,
      "BE_upper":0,
      "NE_mean":0,
      "NE_lower":0,
      "NE_upper":0,
      "BC_mean":0,
      "BC_lower":0,
      "BC_upper":0,
      "NC_mean":0,
      "NC_lower":0,
      "NC_upper":0,
      }
    ];

    $scope.value=[];

    $scope.datiGaficoAP={
      province:[],
      morticausa:[],
      AP_mean:[],
      AP_lower:[],
      AP_upper:[],
      BE_mean:[],
      BE_lower:[],
      BE_upper:[],
      rr_mean:[],
      rr_lower:[],
      rr_upper:[]
    }
    
    var item = document.getElementById("bar_chart_BOD");
    item.parentNode.removeChild(item);
    var item = document.getElementById("line_chart_BOD");
    item.parentNode.removeChild(item);
    document.getElementById("bar_chart_BOD_card").innerHTML = '<canvas ngHide="loadedMortality" id="bar_chart_BOD" width="800" height="250"></canvas>';
    document.getElementById("line_chart_BOD_card").innerHTML = '<canvas ngHide="loadedMortality" id="line_chart_BOD" width="800" height="250"></canvas>';

    $scope.loadData();
  }
  
  $scope.changeOutcome = function changeOutcome(){
    console.log("selected",$scope.selectedoutcome);
    
    $scope.selectedAP="Mean";
    $scope.dati_airq = [
      {
        "provincia":"LE",
      "anno":2018,
      "media":0,
      "popolazione":0,
      "morticausa":0,
      "incidenza":0,
      "fascia_eta":[0,120],
      "rr_mean":0,
      "rr_lower":0,
      "rr_upper":0,
      "AP_mean":0,
      "AP_lower":0,
      "AP_upper": 0,
      "BE_mean":0,
      "BE_lower":0,
      "BE_upper":0,
      "NE_mean":0,
      "NE_lower":0,
      "NE_upper":0,
      "BC_mean":0,
      "BC_lower":0,
      "BC_upper":0,
      "NC_mean":0,
      "NC_lower":0,
      "NC_upper":0,
      }
    ];

    $scope.value=[];

    $scope.datiGaficoAP={
      province:[],
      morticausa:[],
      AP_mean:[],
      AP_lower:[],
      AP_upper:[],
      BE_mean:[],
      BE_lower:[],
      BE_upper:[],
      rr_mean:[],
      rr_lower:[],
      rr_upper:[]
    }
    
    var item = document.getElementById("bar_chart_BOD");
    item.parentNode.removeChild(item);
    var item = document.getElementById("line_chart_BOD");
    item.parentNode.removeChild(item);
    document.getElementById("bar_chart_BOD_card").innerHTML = '<canvas ngHide="loadedMortality" id="bar_chart_BOD" width="800" height="250"></canvas>';
    document.getElementById("line_chart_BOD_card").innerHTML = '<canvas ngHide="loadedMortality" id="line_chart_BOD" width="800" height="250"></canvas>';

    $scope.loadData();
  }

}])

