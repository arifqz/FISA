// d3Graph.js
import * as d3 from "d3";

export function createGraph(data, containerElement) {
  const margin = {top: 40, right: 20, bottom: 50, left: 40};
  const container = d3.select(containerElement);

  // Function to draw the graph
  function drawGraph() {
    // Clear the SVG container
    container.select("svg").remove();

    // Get the updated dimensions of the container
    const containerRect = container.node().getBoundingClientRect();
    const width = containerRect.width - margin.left - margin.right;
    const height = containerRect.height - margin.top - margin.bottom;

    const x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .padding(0.05);

    const y = d3.scaleLinear()
      .rangeRound([height, 0]);

    const xAxis = d3.axisTop(x0).tickSize(0).tickSizeOuter(0); // Remove lines emanating from years
    const yAxis = d3.axisLeft(y);

    const svg = container.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define the halftone pattern
    svg.append("defs")
      .append("pattern")
        .attr("id", "halftone")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", "8")
        .attr("height", "8")
        .attr("x", "4")
        .attr("y", "4")
      .append("circle")
        .attr("cx", "4")
        .attr("cy", "4")
        .attr("r", "4")
        .attr("fill", "white");

    // Define the diagonal stripe pattern
    svg.append("defs")
      .append("pattern")
        .attr("id", "diagonal-stripe")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", "8")
        .attr("height", "8")
      .append("path")
        .attr("d", "M-1,1 l2,-2 M0,8 l8,-8 M7,9 l1,-1")
        .attr("stroke", "white")
        .attr("stroke-width", "2");

    const keys = ["totalOrders", "totalTargets"];

    x0.domain(data.map(d => d.year));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, d => Math.max(d.totalOrders, d.totalTargets))]).nice();

    svg.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("transform", d => `translate(${x0(d.year)},0)`)
      .selectAll("rect")
      .data(d => keys.map(key => ({key, value: d[key]})))
      .enter().append("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => d.key === "totalOrders" ? "url(#halftone)" : "url(#diagonal-stripe)");

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,0)`)
      .call(xAxis)
      .call(g => g.select(".domain").remove());

    svg.append("g")
      .attr("class", "axis")
      .call(yAxis);

    // Add labels under each bar
    svg.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("transform", d => `translate(${x0(d.year)},0)`)
      .selectAll("text")
      .data(d => keys.map(key => ({key, value: d[key]})))
      .enter().append("text")
        .attr("x", d => x1(d.key) + x1.bandwidth() / 2)
        .attr("y", height + margin.bottom / 3)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "1vw") // Adjust this value to match the year labels
        .style("font-family", "sans-serif") // Adjust this value to match the year labels
        .text(d => d.key === "totalOrders" ? "Total Orders" : "Total Targets");

    // Add line below the bars and above the labels
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", height)
      .attr("x2", width)
      .attr("y2", height)
      .attr("stroke", "white") // Change the color of the line to white
      .attr("stroke-width", 1);
  }

  // Draw the graph when the page loads
  drawGraph();

  // Redraw the graph when the window is resized
  window.addEventListener("resize", drawGraph);
}