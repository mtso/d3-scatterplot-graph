// https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json

const d3 = require('d3')
import { dataUrl, width, height, padding, dot_radius } from './config'

document.body.style.cssText = 'background-color:lightgray; text-align:center; padding:2em'

let source = document.createElement('a')
source.href = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
source.innerText = 'Data Source'

// sg stands for 'Scatterplot Graph'
const sg = d3
  .select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('class', 'container')
  .style('background-color', 'white')

document.body.appendChild(document.createElement('br'))
document.body.appendChild(source)

sg.append('g')
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('x', width / 2)
  .attr('y', 30)
  .text('Doping in Professional Bicycle Racing')
  .style('font-weight', 'bold')
  .style('font-size', '0.8em')

sg.append('g')
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('x', width / 2)
  .attr('y', 46)
  .text('35 Fastest times up Alpe d\'Huez — Normalized to 13.8km distance')
  .style('font-size', '0.8em')

sg.append("text")
  .attr('transform', 'translate(' + -padding * 0.5 + ', ' + padding * 2.25 + ')rotate(-90)')
  .attr("x", padding)
  .attr("y", padding)
  .attr("text-anchor", "middle")
  .style("font-size", "15px")
  .text("Ranking")
  .style('font-weight', 'bold')
  .style('font-size', '0.8em')

sg.append("text")
  .attr("x", (width / 2))
  .attr("y", height - padding * 0.4)
  .attr("text-anchor", "middle")
  .style("font-size", "15px")
  .text("Seconds Behind Fastest Time")
  .style('font-weight', 'bold')
  .style('font-size', '0.8em')

function display() {
  let data = JSON.parse(this.responseText)

  // plot time vs ranking
  let minTime = d3.min(data, d => d.Seconds)
  let maxTime = d3.max(data, d => d.Seconds)
  let xScale = d3.scaleLinear()
                 .domain([maxTime - minTime + 10, 0])
                 .range([padding, width - padding])
  let minPlace = d3.min(data, d => d.Place)
  let maxPlace = d3.max(data, d => d.Place)
  let yScale = d3.scaleLinear()
                 .domain([minPlace, maxPlace])
                 .range([padding, height - padding])

  let xAxis = d3.axisBottom(xScale)
  let yAxis = d3.axisLeft(yScale)

  sg.append('g')
    .attr('transform', 'translate(0, ' + (height - padding * 0.8) + ')')
    .call(xAxis)
  sg.append('g')
    .attr('transform', 'translate(' + padding * 0.8 + ', 0)')
    .call(yAxis)

  // ref tooltip
  let info;
  let line;

  function onMouseOver(d) {
    let cx = xScale(Math.abs(minTime - d.Seconds))
    let cy = yScale(d.Place)
    let x = cx - cx * 0.8
    let y = cy - cy * 0.8
    let infosize = {
      width: 300,
      height: 150,
      padding: 20,
    }
    let dopepad = d['Doping'] ? 0 : 20

    let details = [
      'Name',
      'Nationality',
      'Year',
      'Time',
      'Doping',
    ]

    // details = details.join('')
    line = sg.append('line')
      .attr('x1', x + infosize.width)
      .attr('y1', y + infosize.height - dopepad)
      .attr('x2', cx)
      .attr('y2', cy)
      .attr('stroke-width', 1)
      .attr('stroke', '#555')

    info = sg.append('g')

    info.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', infosize.width)
      .attr('height', infosize.height - dopepad)
      .attr('fill', 'rgba(240, 240, 240, 0.9)')
      .style('outline', '1px solid gray')

    let textbox = info.append('text')
      .attr('x', x + infosize.padding / 2)
      .attr('y', y + infosize.padding)
      .attr('fill', 'black')

    details.forEach((detail) => {
      if (!d[detail]) {
        return;
      }
      let linewidth = 28
      let detailString = ('' + d[detail]).substring(0, linewidth)
      let ellipsis = (('' + d[detail]).length > linewidth) ? '...' : ''
      textbox.append('tspan')
        .attr('x', x + infosize.padding)
        .attr('dy', 20)
        .text(detail + ': ' + detailString + ellipsis )
    })

    d3.select(this).attr('r', dot_radius * 1.5)
  }

  function onMouseOut(d) {
    info.remove()
    line.remove()
    d3.select(this).attr('r', dot_radius)
  }

  sg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', dot_radius)
    .attr('cx', d => xScale(Math.abs(minTime - d.Seconds)))
    .attr('cy', d => yScale(d.Place))
    .attr('fill', d => d.Doping ? 'red' : 'gray')
    .on('mouseover', onMouseOver)
    .on('mouseout', onMouseOut)
}

const req = new XMLHttpRequest()
req.addEventListener('load', display)
req.open('GET', dataUrl)
req.send()
