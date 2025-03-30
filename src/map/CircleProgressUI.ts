// circleProgress.ts

/**
 * Creates an SVG-based circular progress indicator
 * @param containerId - ID of the container to insert the progress circle
 * @param percentage - Current progress percentage (0-100)
 * @param options - Optional configuration
 */
function createCircleProgress(
    containerId: string,
    percentage: number,
    options: {
      size?: number;
      strokeWidth?: number;
      primaryColor?: string;
      incrementColor?: string;
      backgroundColor?: string;
      incrementSize?: number;
      centerText?: string;
      textColor?: string;
      textSize?: number;
      animate?: boolean;
      animationDuration?: number;
    } = {}
  ): void {
    // Default options
    const {
      size = 200,
      strokeWidth = 15,
      primaryColor = "#4CAF50",
      incrementColor = "#8BC34A",
      backgroundColor = "#e6e6e6",
      incrementSize = 10,
      centerText = `${percentage}%`,
      textColor = "#333333",
      textSize = 24,
      animate = true,
      animationDuration = 1000
    } = options;
  
    // Calculate values for the circle
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offsetPercent = percentage / 100;
    const incrementPercent = (percentage + incrementSize) / 100;
    
    // Ensure percentage is within bounds
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
    const clampedIncrementPercentage = Math.min(Math.max(percentage + incrementSize, 0), 100);
    
    // Calculate stroke-dashoffset values
    const mainOffset = circumference - (circumference * offsetPercent);
    const incrementOffset = circumference - (circumference * incrementPercent);
    const incrementStrokeDasharray = `${(incrementPercent - offsetPercent) * circumference} ${circumference}`;
  
    // Create the SVG elements
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", size.toString());
    svg.setAttribute("height", size.toString());
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.classList.add("circle-progress-svg");
  
    // Background circle
    const backgroundCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    backgroundCircle.setAttribute("cx", (size / 2).toString());
    backgroundCircle.setAttribute("cy", (size / 2).toString());
    backgroundCircle.setAttribute("r", radius.toString());
    backgroundCircle.setAttribute("fill", "none");
    backgroundCircle.setAttribute("stroke", backgroundColor);
    backgroundCircle.setAttribute("stroke-width", strokeWidth.toString());
    
    // Progress circle (main)
    const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    progressCircle.setAttribute("cx", (size / 2).toString());
    progressCircle.setAttribute("cy", (size / 2).toString());
    progressCircle.setAttribute("r", radius.toString());
    progressCircle.setAttribute("fill", "none");
    progressCircle.setAttribute("stroke", primaryColor);
    progressCircle.setAttribute("stroke-width", strokeWidth.toString());
    progressCircle.setAttribute("stroke-dasharray", circumference.toString());
    progressCircle.setAttribute("stroke-dashoffset", animate ? circumference.toString() : mainOffset.toString());
    progressCircle.setAttribute("transform", `rotate(-90 ${size / 2} ${size / 2})`);
    progressCircle.classList.add("circle-progress-main");
    
    // Increment circle (next target)
    if (incrementSize > 0 && percentage < 100 - incrementSize) {
      const incrementCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      incrementCircle.setAttribute("cx", (size / 2).toString());
      incrementCircle.setAttribute("cy", (size / 2).toString());
      incrementCircle.setAttribute("r", radius.toString());
      incrementCircle.setAttribute("fill", "none");
      incrementCircle.setAttribute("stroke", incrementColor);
      incrementCircle.setAttribute("stroke-width", strokeWidth.toString());
      incrementCircle.setAttribute("stroke-dasharray", incrementStrokeDasharray);
      incrementCircle.setAttribute("stroke-dashoffset", animate ? circumference.toString() : incrementOffset.toString());
      incrementCircle.setAttribute("transform", `rotate(-90 ${size / 2} ${size / 2})`);
      incrementCircle.classList.add("circle-progress-increment");
      svg.appendChild(incrementCircle);
    }
    
    // Text in the middle
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", (size / 2).toString());
    text.setAttribute("y", (size / 2).toString());
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "central");
    text.setAttribute("fill", textColor);
    text.setAttribute("font-size", textSize.toString());
    text.classList.add("circle-progress-text");
    text.textContent = centerText;
    
    // Append all elements to SVG
    svg.appendChild(backgroundCircle);
    svg.appendChild(progressCircle);
    svg.appendChild(text);
    
    // Create wrapper div with class
    const wrapper = document.createElement("div");
    wrapper.classList.add("circle-progress-container");
    wrapper.appendChild(svg);
    
    // Insert the progress circle into the container
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
      container.appendChild(wrapper);
      
      // Apply animation if needed
      if (animate) {
        setTimeout(() => {
          const mainCircle = container.querySelector('.circle-progress-main') as SVGCircleElement;
          const incrementCircle = container.querySelector('.circle-progress-increment') as SVGCircleElement;
          
          if (mainCircle) {
            mainCircle.style.transition = `stroke-dashoffset ${animationDuration}ms ease-in-out`;
            mainCircle.setAttribute("stroke-dashoffset", mainOffset.toString());
          }
          
          if (incrementCircle) {
            incrementCircle.style.transition = `stroke-dashoffset ${animationDuration}ms ease-in-out`;
            incrementCircle.setAttribute("stroke-dashoffset", incrementOffset.toString());
          }
        }, 50);
      }
    } else {
      console.error(`Container with ID "${containerId}" not found.`);
    }
  }
  
  /**
   * Returns the HTML markup for a circle progress component
   * This can be used with innerHTML if you prefer not to use the DOM manipulation function
   */
  function CircleProgressHTML(
    percentage: number,
    options: {
      size?: number;
      strokeWidth?: number;
      primaryColor?: string;
      incrementColor?: string;
      backgroundColor?: string;
      incrementSize?: number;
      centerText?: string;
      textColor?: string;
      textSize?: number;
    } = {}
  ): string {
    // Default options
    const {
      size = 35,
      strokeWidth = 5,
      primaryColor = "#4CAF50",
      incrementColor = "#8BC34A",
      backgroundColor = "#e6e6e6",
      incrementSize = 10,
      centerText = `${percentage}%`,
      textColor = "#333333",
      textSize = 14
    } = options;
  
    // Calculate values for the circle
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offsetPercent = percentage / 100;
    const incrementPercent = Math.min((percentage + incrementSize) / 100, 1);
    
    // Ensure percentage is within bounds
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
    
    // Calculate stroke-dashoffset values
    const mainOffset = circumference - (circumference * offsetPercent);
    const incrementOffset = circumference - (circumference * incrementPercent);
    const incrementStrokeDasharray = `${(incrementPercent - offsetPercent) * circumference} ${circumference}`;
  
    // Build HTML string
    let html = `
      <div class="circle-progress-container">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="circle-progress-svg">
          <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" 
                  fill="none" 
                  stroke="${backgroundColor}" 
                  stroke-width="${strokeWidth}">
          </circle>
          <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" 
                  fill="none" 
                  stroke="${primaryColor}" 
                  stroke-width="${strokeWidth}" 
                  stroke-dasharray="${circumference}" 
                  stroke-dashoffset="${mainOffset}"
                  transform="rotate(-90 ${size / 2} ${size / 2})" 
                  class="circle-progress-main">
          </circle>`;
          
    // Add increment circle if needed
    if (incrementSize > 0 && percentage < 100 - incrementSize) {
      html += `
          <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" 
                  fill="none" 
                  stroke="${incrementColor}" 
                  stroke-width="${strokeWidth}" 
                  stroke-dasharray="${incrementStrokeDasharray}" 
                  stroke-dashoffset="${incrementOffset}"
                  transform="rotate(-90 ${size / 2} ${size / 2})" 
                  class="circle-progress-increment">
          </circle>`;
    }
    
    // Add text and close tags
    html += `
          <text x="${size / 2}" y="${size / 2}" 
                text-anchor="middle" 
                dominant-baseline="central"
                fill="${textColor}" 
                font-size="${textSize}" 
                class="circle-progress-text">${centerText}</text>
        </svg>
      </div>`;
      
    return html;
  }
  
  // Export functions
  export { CircleProgressHTML };