app.directive('barChart', ($window) => {
	return {
		restrict: 'E',
		// templateUrl: 'js/common/directives/d3/barChart.html',
		scope:{
			data: '=',
			labels: '='
		},
		link: (scope, element, attrs) => {
			var data = scope.data
			var labels = scope.labels
			var width = 0
			var windowWidth = $window.innerWidth/4
			labels.forEach((label) => {
				var size = label.length * 10
				width =  size > width ? size : width
			})
			width = windowWidth < width ? width: windowWidth
			var barHeight = 30;

			var x = d3.scale.linear()
				.domain([0, d3.max(data)])
				.range([0, width]);

			var svg = d3.select(element[0])
				.append('svg')
				.attr('width', width)
				.attr('height', (barHeight + 15) * data.length)

			var bar = svg.selectAll('g')
				.data(data)
				.enter().append('g')
				.attr('transform', (d,i) => "translate(0," + i * (barHeight+15) +")")
				
				bar.append('text')
					.attr('class', 'name')
					.attr('x', 0)
					.attr('y', 6)
					.attr('dy', '.35em')
					.text((d,i) => scope.labels[i])

				bar.append('rect')
					.attr('x', 0)
					.attr('y', 12)
					.attr('fill', 'steelblue')
					.attr('width',x)
					.attr('height', barHeight - 3 )


				bar.append('text')
					.attr('class', 'data')
					.attr('stroke', 'white')
					.attr('x', 5)
					.attr('y', (barHeight-3)/2 + 12)
					.attr('dy', '.35em')
					.text((d) => d+'%')
		}
	}
})