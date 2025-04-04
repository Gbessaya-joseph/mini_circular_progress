// First, we'll need to include a library for PDF generation
// jsPDF is a great choice for client-side PDF generation
// Add this to your HTML head section:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

// Assuming your pie chart is in a div with id "pieChart"
function setupExportButtons() {
    // Create export buttons container
    const exportContainer = document.createElement('div');
    exportContainer.className = 'export-options';
    exportContainer.style.marginTop = '20px';
    
    // Add PDF export button
    const pdfButton = createExportButton('Export as PDF', exportToPDF);
    
    // Add PNG export button
    const pngButton = createExportButton('Export as PNG', exportToPNG);
    
    // Add SVG export button (if your chart is SVG-based)
    const svgButton = createExportButton('Export as SVG', exportToSVG);
    
    // Add Markdown export button
    const mdButton = createExportButton('Export as Markdown', exportToMarkdown);
    
    // Append all buttons to container
    exportContainer.appendChild(pdfButton);
    exportContainer.appendChild(pngButton);
    exportContainer.appendChild(svgButton);
    exportContainer.appendChild(mdButton);
    
    // Add container after the chart
    const chartElement = document.getElementById('pieChart');
    chartElement.parentNode.insertBefore(exportContainer, chartElement.nextSibling);
  }
  
  function createExportButton(text, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.margin = '5px';
    button.style.padding = '8px 16px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', clickHandler);
    return button;
  }
  
  // PDF Export Function
  function exportToPDF() {
    const { jsPDF } = window.jspdf;
    
    // Create a new PDF document
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Get the chart element
    const chartElement = document.getElementById('pieChart');
    
    // First get the input values to use as filename and for title
    const inputFields = document.querySelectorAll('input[type="number"]');
    let filename = 'pie-chart';
    let valuesText = '';
    
    inputFields.forEach((input, index) => {
      if (input.value) {
        valuesText += `${input.name || 'Value ' + (index + 1)}: ${input.value}%${index < inputFields.length - 1 ? ', ' : ''}`;
      }
    });
    
    // Use html2canvas to convert the chart to an image
    html2canvas(chartElement).then(canvas => {
      // Add a title to the PDF
      doc.setFontSize(16);
      doc.text('Pie Chart Export', 20, 20);
      
      // Add the values used
      doc.setFontSize(12);
      doc.text(`Values: ${valuesText}`, 20, 30);
      
      // Add current date
      const today = new Date();
      doc.text(`Generated on: ${today.toLocaleDateString()}`, 20, 40);
      
      // Calculate the available width and scale appropriately
      const imgWidth = 260; // mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      // Add the canvas as an image
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 20, 50, imgWidth, imgHeight);
      
      // Save the PDF
      doc.save(`${filename}.pdf`);
    });
  }
  
  // PNG Export Function
  function exportToPNG() {
    const chartElement = document.getElementById('pieChart');
    
    html2canvas(chartElement).then(canvas => {
      // Create a link element
      const link = document.createElement('a');
      
      // Set link properties
      link.download = 'pie-chart.png';
      link.href = canvas.toDataURL('image/png');
      
      // Simulate click to trigger download
      link.click();
    });
  }
  
  // SVG Export Function (if your chart is SVG-based)
  function exportToSVG() {
    // Check if chart is SVG-based
    const chartElement = document.getElementById('pieChart');
    const svgElement = chartElement.querySelector('svg');
    
    if (svgElement) {
      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true);
      
      // Set the SVG attributes for standalone use
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clonedSvg.setAttribute('version', '1.1');
      
      // Convert SVG to string
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      
      // Create a Blob from the SVG data
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      
      // Create a link to download the Blob
      const link = document.createElement('a');
      link.download = 'pie-chart.svg';
      link.href = URL.createObjectURL(blob);
      
      // Trigger download
      link.click();
    } else {
      alert('SVG export is only available for SVG-based charts.');
    }
  }
  
  // Markdown Export Function
  function exportToMarkdown() {
    // Get chart data
    const chartData = getChartData(); // You need to implement this function to get your chart data
    
    // Create markdown content
    let markdownContent = '# Pie Chart Data\n\n';
    markdownContent += '| Category | Percentage |\n';
    markdownContent += '|----------|------------|\n';
    
    // Add the data rows
    chartData.forEach(item => {
      markdownContent += `| ${item.label} | ${item.value}% |\n`;
    });
    
    // Add timestamp
    const now = new Date();
    markdownContent += `\n*Generated on ${now.toLocaleString()}*\n`;
    
    // Create a Blob with the markdown content
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    
    // Create a link to download the markdown
    const link = document.createElement('a');
    link.download = 'pie-chart-data.md';
    link.href = URL.createObjectURL(blob);
    
    // Trigger download
    link.click();
  }
  
  // You'll need to implement this function based on how your chart data is stored
  function getChartData() {
    // This is a placeholder - replace with your actual data retrieval logic
    const data = [];
    const inputFields = document.querySelectorAll('input[type="number"]');
    
    inputFields.forEach((input, index) => {
      if (input.value) {
        data.push({
          label: input.name || `Segment ${index + 1}`,
          value: parseFloat(input.value)
        });
      }
    });
    
    return data;
  }
  
  // Call this function when your page loads
  document.addEventListener('DOMContentLoaded', setupExportButtons);