//My Thanks go to the creator of http://sujeetsr.github.io/d3.slider/ 

var dataset = []
    
var margin = {top: 20, right: 30, bottom: 30, left: 50},
    width = 1120 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1)

var y = d3.scale.linear()
    .range([height, 0])

var c = d3.scale.linear()
    .range([0,255])

var color = d3.scale.category20c();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

    // #对应id
    // .对应class
    // 不加对应html标签
var chart= d3.select('#chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.csv('data.csv', function(data) {
    var dataf = data.filter(function(el){return !isNaN(parseFloat(el.wage))});
    dataset = dataf.map(function(d){
        return {
            'state': d.state, 
            'wage': parseFloat(d.wage)
            }
    });
    
    // Scale the domain of the data
    x.domain(dataset.map(function(d){ return d.state }))
    y.domain([4, d3.max(dataset, function(d){return d.wage})])
    c.domain([4, d3.max(dataset, function(d){return d.wage})])

    // Create axes
    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
      .append('text')
        .attr('class', 'label')
        .attr('text-anchor', 'end')
        .attr('x', width-20)
        .attr('y', 30)
        .text('State')

    chart.append('g')
        .attr('class', 'axis')
        .call(yAxis)
      .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -35)
        .style('text-anchor', 'end')
        .text('Minimum wage (USD)')
    
    // Create bars
        // Create bars
    var bar = chart.selectAll('.bar')
        .data(dataset)
        .enter().append('g')
        .attr('class', 'bar')
        .attr("id", function(d, i) {
            return i;
        })
        .attr("fill", function(d, i) {
            return color(i);
        });

    bar.append("rect")
        .attr('class','rect')
        .attr("y", function(d) { return y(d.wage); })
        .attr('x', function(d) {return  x(d.state);})
        .attr("height", function(d) { return height - y(d.wage); })
        .attr("width", x.rangeBand()-2 )
        // .style("fill", function(d,i) {return "" + color(i) + "";});

    bar.append("text")
        .attr('class','text')
        .attr("y", function(d) { return y(d.wage); })
        .attr('x', function(d) {return  x(d.state)})
        .attr('width',x.rangeBand())
        .attr("dy", "1em")
        .attr('fill','white')
        .text(function(d) { return d.wage; });

    //tick formatter 
    var tickFormatter = function(d) {
        return d.slice(0,1)+d.slice(2);
        }


    var slider = d3.slider()
                .min(1985)
                .max(2015)
                .ticks(10)
                .stepValues(['1985','1990','1995','2000','2005','2010','2015']);
                //.tickFormat(tickFormatter);
// Render the slider in the div
    d3.select('#slider').call(slider);



    //mouseover activities
    bar.on("mouseover",function(d,i){
        console.log("haha" + d.state)
        d3.select(this)
            .attr("fill","green");
        })

       .on("mouseout",function(){
         d3.select(this).attr("fill", function() {return "" + color(this.id) + "";});   
        })
    //sort activities
    d3.select('input').on('change', change)

    function change() {
        var x0 = x.domain(dataset.sort(this.checked
            ? function(a,b){return b.wage - a.wage}
            : function(a,b){return d3.ascending(a.state, b.state)})
            .map(function(d) {return d.state}))
            .copy();

        var transition = chart.transition().duration(750)

        transition.selectAll('.text')
            .attr('x', function(d) {
                return x0(d.state);})

        transition.selectAll('.rect')
            .attr('x', function(d) {
            return x0(d.state);})

        transition.select('.x.axis')
            .call(xAxis)
    }

    function dataChange(){
        console.log("you pressed slider")
    }
})