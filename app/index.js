// https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json

const d3 = require('d3')
import { dataUrl, width, height, padding } from './config'

// sg stands for 'Scatterplot Graph'
const sg = d3
  .select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('class', 'container')

function display() {
  let data = JSON.parse(this.responseText)

  // plot time vs ranking
  let minTime = d3.min(data, d => d.Seconds)
  let maxTime = d3.max(data, d => d.Seconds)
  let xScale = d3.scaleLinear()
                 .domain([minTime, maxTime])
                 .range([padding, width - padding])
  let minPlace = d3.min(data, d => d.Place)
  let maxPlace = d3.max(data, d => d.Place)
  let yScale = d3.scaleLinear()
                 .domain([minPlace, maxPlace])
                 .range([height - padding, padding])


  let info;
  function onMouseOver(d) {
    // console.log(d)
    info = sg.append('g')

    let x = xScale(d.Seconds)
    let y = yScale(d.Place)
    info.append('rect')
      .attr('x', x - x / 2)
      .attr('y', y - y / 2)
      .attr('width', 50)
      .attr('height', 50)
      .attr('fill', 'black')
    d3.select(this).attr('r', 30)
  }
  function onMouseOut(d) {
    info.remove()
    d3.select(this).attr('r', 10)
  }

  sg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', 10)
    .attr('cx', d => xScale(d.Seconds))
    .attr('cy', d => yScale(d.Place))
    .attr('fill', 'red')
    .on('mouseover', onMouseOver)
    .on('mouseout', onMouseOut)
}

const req = new XMLHttpRequest()
req.addEventListener('load', display)
req.open('GET', dataUrl)
req.send()
