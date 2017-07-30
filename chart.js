//My Thanks go to the creator of http://sujeetsr.github.io/d3.slider/ 

var dataset = []
    
var margin = {top: 20, right: 30, bottom: 30, left: 60},
    width = 1160 - margin.left - margin.right,
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



d3.csv('income.csv', function(data) {

    dataf = data.map(function(d){
        return {
            'state': d.state, 
            'income': parseFloat(d.income),
            'year': parseFloat(d.year)
            }
    });

    //filter dataf to a specific year 
    dataset = dataf.filter(function(el) {return parseFloat(el.year)==1985});
    
    // Scale the domain of the data
    x.domain(dataset.map(function(d){ return d.state }))
    y.domain([4, d3.max(dataf, function(d){return d.income})])
    c.domain([4, d3.max(dataset, function(d){return d.income})])

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
        .attr('y', -50)
        .style('text-anchor', 'end')
        .text('Median Household Annual Income (USD)')
    
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
        .attr("y", function(d) { return y(d.income); })
        .attr('x', function(d) {return  x(d.state);})
        .attr("height", function(d) { return height - y(d.income); })
        .attr("width", x.rangeBand()-2 )
        



    var income_usa = [23618,29943,34076,41990,46326,49276,56516];

    
    bar.append("text")
        .attr('class','text')
        //.attr('transform', 'rotate(30)')
        .attr("y", function(d) { return y(d.income); })
        .attr('x', function(d) {return  x(d.state)})
        .attr('width',x.rangeBand())
        .attr("dy", "1em")
        .attr('fill','white')
        .text(function(d) { 
           var textFormatter =  d3.format("2.0f");
            return textFormatter(d.income/income_usa[0]*100); });




    //tick formatter 
    var formatter = d3.format(".4r");
    var tickFormatter = function(d) {
    return formatter(d);
    }
    
    var dispatch2 = d3.dispatch('updatedata');

    var slider = d3.slider()
                .min(1985)
                .max(2015)
                .ticks(5)
                .stepValues(['1985','1990','1995','2000','2005','2010','2015'])
                .tickFormat(tickFormatter)
                .on("slidermove.one",function(value){
        dispatch2.updatedata(value);
        });       
          

    d3.select('#slider')
        .call(slider);
           

    //mouseover activities
    bar.on("mouseover",function(d,i){
        console.log("haha " + slider.value())
        d3.select(this)
            .attr("fill","red");
        })

       .on("mouseout",function(){
         d3.select(this).attr("fill", function() {return "" + color(this.id) + "";});   
        })

    // dispatch 2

    dispatch2.on('updatedata',function(toYear){
        update(toYear)
    })

    function update(toYear){
        dataset = dataf.filter(function(el) {return parseFloat(el.year)==toYear});

        chart.selectAll('.rect')
         .data(dataset)
         .transition().duration(1000)
         .attr('height', function(d) {
          return height - y(d.income);})
         .attr('y', function(d) {
        return y(d.income);});
           
        chart.selectAll('.text')
            .data(dataset)
            .transition().duration(1000).delay(750)
            .attr('y', function(d) {
                return y(d.income);})
            //.text(function(d) { return d.income; });
            .text(function(d) { 
           var textFormatter =  d3.format("2.0f");
           var i = (toYear - 1985)/5
            return textFormatter(d.income/income_usa[i]*100); 
            });



    }



    //sort activities
    d3.select('input').on('click', change)

    var sorted = false;

    function change() {

        sorted = sorted ? false:true 
        console.log("now it is "+sorted)

         var x0 = x.domain(dataset.sort(sorted
            ? function(a,b){return b.income - a.income}
            : function(a,b){return d3.ascending(a.state, b.state)})
            .map(function(d) {return d.state}))
            .copy();
        // var x0 = x.domain(dataset.sort(this.checked
        //     ? function(a,b){return b.income - a.income}
        //     : function(a,b){return d3.ascending(a.state, b.state)})
        //     .map(function(d) {return d.state}))
        //     .copy();

        var transition = chart.transition().duration(750)

        transition.selectAll('.text')
            .attr('x', function(d) {
                return x0(d.state);});

        transition.selectAll('.rect')
            .attr('x', function(d) {
            return x0(d.state);});

        transition.select('.x.axis')
           .call(xAxis)

    }
})









    