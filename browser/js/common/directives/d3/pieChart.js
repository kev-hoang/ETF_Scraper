app.directive('pieChart', ($window) => {
	return {
		restrict: 'E',
		scope:{
			data: '=',
			labels: '=',
			name: '='
		},
		link: (scope, element, attrs) => {
			var data = scope.data
			var labels = scope.labels
			
			var width = $window.innerWidth/4
			var legendWidth = 0;
			labels.forEach((label) => {
				var size = label.length * 10
				legendWidth =  size > legendWidth ? size : legendWidth
			})
			var height = 450;
			var radius = Math.min(width, height) / 2;
			var color = d3.scale.category20b();
			var donutWidth = width < 100 ? radius - 25 : 75;

			var svg = d3.select(element[0])
				.append('svg')
				.attr('width', (width+legendWidth)*1.3)
				.attr('height', height)
				.append('g')
				.attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

			var tooltip = svg.append('div')                                            
			.attr('class', 'tooltip');                                 
			          
			tooltip.append('div')                                        
			.attr('class', 'sector');                                  
			 
			tooltip.append('div')                                          
			.attr('class', 'percent');                                        

			var arc = d3.svg.arc()
				.innerRadius(radius - donutWidth)
  				.outerRadius(radius);

  			var pie = d3.layout.pie()
				.value((d) => d)
				.sort(null);

			var path = svg.selectAll('path')
				.data(pie(data))
				.enter()
				.append('path')
				.attr('d', arc)
				.attr('stroke', 'white')
				.attr('fill', function(d, i) { 
					return color(labels[i]);
				});

			svg.append('text')
				.attr('dy', '0.35em')
				.attr('x', scope.name.length*-6)
				.attr('y', 0)
				.attr('font-size', '24px')
				.attr('font-weight', 'bold')
				.text(scope.name)


			var legend = svg.selectAll('.legend')
				.data(color.domain())
				.enter().append('g')
				.attr('class', 'legend')
				.attr('transform', (d,i) => "translate("+(radius+50)+"," + ((i * 30)-radius) +")")

			legend.append('rect')
				.attr('width', '40')
				.attr('height', '40')
				.attr('fill', color)

			legend.append('text')
				.attr('x', 50)
				.attr('y', 20)
				.text((d) => d)

			legend.append('text')
				.attr('x', legendWidth*1.3)
				.attr('y', 20)
				.text((d, i) => data[i]+'%')

			path.on('mouseover', function(d) {                       
				// var total = d3.sum(dataset.map(function(d) {                
				// 	return d.count;                                       
				// }));                                                     
				// var percent = Math.round(1000 * d.data.count / total) / 10; 
				tooltip.select('.percent').html(d.data + '%');             
				// tooltip.select('.percent').html(percent + '%');           
				tooltip.style('display', 'block');                       
			});                                                          

			path.on('mouseout', function() {                           
				tooltip.style('display', 'none');                         
			});      
		}
	}
})