angular.module('universityApp', [])
	.controller('MainCtrl', ['$http', function ($http) {
		var self = this;
		var recentFoodServices = [];

		$http.get('https://api.uwaterloo.ca/v2/weather/current.json?key=2e1729b95bedbe3f45c6e512ea646a04').then(function(response){
			var weather = response.data.data;
			self.date = weather.observation_time.substring(0, 10);
			self.temp = weather.temperature_current_c;
			self.minTemp = weather.temperature_24hr_min_c;
			self.maxTemp = weather.temperature_24hr_max_c;
		}, function(errResponse){
			console.log("error while fetching weather");
		});

		$http.get('https://api.uwaterloo.ca/v2/news.json?key=2e1729b95bedbe3f45c6e512ea646a04').then(function(response){
			var news = response.data.data;
			var recentNews = [];
			for(var i=0;i<25;i++){
				recentNews.push({"title": news[i].title, "link": news[i].link});
			}
			self.recentNews = recentNews;
		}, function(errResponse){
			console.log("error while fetching news");
		});

		$http.get('https://api.uwaterloo.ca/v2/events.json?key=2e1729b95bedbe3f45c6e512ea646a04').then(function(response){
			var events = response.data.data;
			console.log(events);
			var recentEvents = [];
			for(var i=0;i<25;i++){
				recentEvents.push({"title": events[i].title, "site_name": events[i].site_name,
					"startTime": events[i].times[0].start.substring(11,16), "startDate": events[i].times[0].start.substring(0,10), "link": events[i].link});
			}
			self.recentEvents = recentEvents;
		}, function(errResponse){
			console.log("error while fetching events");
		});

		$http.get('https://api.uwaterloo.ca/v2/foodservices/locations.json?key=2e1729b95bedbe3f45c6e512ea646a04').then(function(response){
			var foodServices = response.data.data;
			self.foodServices = foodServices;
		}, function(errResponse){
			console.log("error while fetching events");
		});

		$http.get('https://api.uwaterloo.ca/v2/codes/units.json?key=2e1729b95bedbe3f45c6e512ea646a04').then(function(response){
			var subjects = response.data.data;
			var subjectNames = [];
			console.log(subjects);
			for(var i=0;i<subjects.length;i++){
				if(subjects[i].unit_code.length < 6)
				subjectNames.push({code: subjects[i].unit_code});
			}
			self.subjects = subjectNames;
			self.selectedSubject = subjectNames[0].code;
		}, function(errResponse){
			console.log("error while fetching subject codes");
		});

		self.displayDescription = function(id){
			if($("#outlet-description-"+id).css('display') === "none"){
				$("#outlet-description-"+id).css({
					display: 'block'
				});
			}else{
				$("#outlet-description-"+id).css({
					display: 'none'
				});
			}
			
		}
		self.catalogVisible = false;
		self.courseVisible = false;

		self.afterSubjectSelect = function(){
			$http.get('https://api.uwaterloo.ca/v2/courses/'+self.selectedSubject.code+'.json?key=2e1729b95bedbe3f45c6e512ea646a04').then(function(response){
				var subject = response.data.data;
				self.subject = subject;
				self.selectedCatalog = subject[0];
				self.courseVisible = false;
				if(self.subject.length < 1){
					alert("No data available for selected subject");
				}else{
					self.catalogVisible = true;
				}
			}, function(errResponse){
				console.log("error while fetching subject codes");
			});
		}

		self.afterCatalogSelect = function(){
			$http.get('https://api.uwaterloo.ca/v2/courses/'
				+self.selectedSubject.code+'/'+self.selectedCatalog.catalog_number+'.json?key=2e1729b95bedbe3f45c6e512ea646a04').then(function(response){
				var subjectDetails = response.data.data;
				self.subjectDetails = subjectDetails;

				if(subjectDetails.prerequisites){
					self.subjectPrerequisites = subjectDetails.prerequisites;
				}else{
					self.subjectPrerequisites = "No Prerequisites";
				}
				if(subjectDetails.antirequisites){
					self.subjectAntirequisites = subjectDetails.antirequisites;
				}else{
					self.subjectAntirequisites = "No Antirequisites";
				}
				self.courseVisible = true;
			}, function(errResponse){
				console.log("error while fetching subject codes");
			});
		}
		
	}])