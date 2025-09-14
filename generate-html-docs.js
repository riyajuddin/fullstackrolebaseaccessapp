#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Documentation files to convert
const docs = [
  {
    input: 'docs/README.md',
    output: 'docs/html/README.html',
    title: 'RBAC Application Documentation Index'
  },
  {
    input: 'docs/ARCHITECTURE.md',
    output: 'docs/html/ARCHITECTURE.html',
    title: 'RBAC Application Architecture Documentation'
  },
  {
    input: 'docs/DATA_FLOW.md',
    output: 'docs/html/DATA_FLOW.html',
    title: 'RBAC Application Data Flow Documentation'
  },
  {
    input: 'docs/COMPONENTS.md',
    output: 'docs/html/COMPONENTS.html',
    title: 'RBAC Application Components Documentation'
  },
  {
    input: 'docs/API_DOCUMENTATION.md',
    output: 'docs/html/API_DOCUMENTATION.html',
    title: 'RBAC Application API Documentation'
  },
  {
    input: 'docs/DEPLOYMENT_GUIDE.md',
    output: 'docs/html/DEPLOYMENT_GUIDE.html',
    title: 'RBAC Application Deployment Guide'
  },
  {
    input: 'docs/TESTING_GUIDE.md',
    output: 'docs/html/TESTING_GUIDE.html',
    title: 'RBAC Application Testing Guide'
  }
];

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
    let html = markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        
        // Lists
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    // Wrap in paragraphs
    html = '<p>' + html + '</p>';
    
    // Fix list formatting
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    return html;
}

// Create HTML output directory
const htmlDir = path.join(__dirname, 'docs', 'html');
if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
}

console.log('🚀 Starting HTML documentation generation...\n');

// Generate HTML files
docs.forEach((doc, index) => {
    try {
        console.log(`📄 Generating ${doc.title}...`);
        
        const inputPath = path.join(__dirname, doc.input);
        const outputPath = path.join(__dirname, doc.output);
        
        // Check if input file exists
        if (!fs.existsSync(inputPath)) {
            console.log(`❌ Input file not found: ${doc.input}`);
            return;
        }
        
        // Read markdown content
        const markdownContent = fs.readFileSync(inputPath, 'utf8');
        
        // Convert to HTML
        const htmlContent = markdownToHtml(markdownContent);
        
        // Generate complete HTML document
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${doc.title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        
        .container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-top: 30px;
        }
        
        h1:first-child {
            margin-top: 0;
        }
        
        h2 {
            color: #34495e;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 5px;
            margin-top: 25px;
        }
        
        h3 {
            color: #2c3e50;
            margin-top: 20px;
        }
        
        h4 {
            color: #7f8c8d;
            margin-top: 15px;
        }
        
        code {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 3px;
            padding: 2px 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        
        pre {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 15px;
            overflow-x: auto;
        }
        
        pre code {
            background-color: transparent;
            border: none;
            padding: 0;
        }
        
        blockquote {
            border-left: 4px solid #3498db;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #f8f9fa;
            font-style: italic;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        
        th {
            background-color: #3498db;
            color: white;
            font-weight: bold;
        }
        
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        
        li {
            margin: 5px 0;
        }
        
        a {
            color: #3498db;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #ecf0f1;
        }
        
        .header h1 {
            color: #2c3e50;
            margin: 0;
            border: none;
        }
        
        .header p {
            color: #7f8c8d;
            margin: 10px 0 0 0;
        }
        
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1000;
        }
        
        .print-button:hover {
            background-color: #2980b9;
        }
        
        @media print {
            .print-button {
                display: none;
            }
            
            body {
                background-color: white;
            }
            
            .container {
                box-shadow: none;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">🖨️ Print PDF</button>
    
    <div class="container">
        <div class="header">
            <h1>${doc.title}</h1>
            <p>RBAC Application Documentation</p>
        </div>
        
        ${htmlContent}
    </div>
</body>
</html>`;
        
        // Write HTML file
        fs.writeFileSync(outputPath, html);
        
        console.log(`✅ Generated: ${doc.output}\n`);
    } catch (error) {
        console.log(`❌ Error generating ${doc.title}:`);
        console.log(`   ${error.message}\n`);
    }
});

// Create index page
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RBAC Application Documentation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        
        .container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #ecf0f1;
        }
        
        .header h1 {
            color: #2c3e50;
            margin: 0;
        }
        
        .header p {
            color: #7f8c8d;
            margin: 10px 0 0 0;
        }
        
        .doc-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .doc-card {
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            background-color: #f8f9fa;
            transition: transform 0.2s;
        }
        
        .doc-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .doc-card h3 {
            color: #2c3e50;
            margin-top: 0;
        }
        
        .doc-card p {
            color: #7f8c8d;
            margin-bottom: 15px;
        }
        
        .doc-card a {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .doc-card a:hover {
            background-color: #2980b9;
        }
        
        .instructions {
            background-color: #e8f4fd;
            border-left: 4px solid #3498db;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        
        .instructions h3 {
            color: #2c3e50;
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>RBAC Application Documentation</h1>
            <p>Comprehensive documentation for the Role-Based Access Control application</p>
        </div>
        
        <div class="instructions">
            <h3>📖 How to Use This Documentation</h3>
            <p><strong>View Online:</strong> Click on any document below to view in your browser</p>
            <p><strong>Print to PDF:</strong> Open any document and use your browser's print function (Ctrl+P / Cmd+P) to save as PDF</p>
            <p><strong>Offline Access:</strong> All documents are self-contained and can be saved for offline viewing</p>
        </div>
        
        <div class="doc-grid">
            <div class="doc-card">
                <h3>📋 Documentation Index</h3>
                <p>Overview and navigation guide for all documentation</p>
                <a href="README.html">View Document</a>
            </div>
            
            <div class="doc-card">
                <h3>🏗️ Architecture</h3>
                <p>System architecture, technology stack, and component relationships</p>
                <a href="ARCHITECTURE.html">View Document</a>
            </div>
            
            <div class="doc-card">
                <h3>🔄 Data Flow</h3>
                <p>Authentication, authorization, and data flow patterns</p>
                <a href="DATA_FLOW.html">View Document</a>
            </div>
            
            <div class="doc-card">
                <h3>🧩 Components</h3>
                <p>Detailed documentation of all frontend and backend components</p>
                <a href="COMPONENTS.html">View Document</a>
            </div>
            
            <div class="doc-card">
                <h3>🔌 API Reference</h3>
                <p>Complete API endpoint documentation with examples</p>
                <a href="API_DOCUMENTATION.html">View Document</a>
            </div>
            
            <div class="doc-card">
                <h3>🚀 Deployment Guide</h3>
                <p>Deployment strategies for development and production</p>
                <a href="DEPLOYMENT_GUIDE.html">View Document</a>
            </div>
            
            <div class="doc-card">
                <h3>🧪 Testing Guide</h3>
                <p>Comprehensive testing strategies and examples</p>
                <a href="TESTING_GUIDE.html">View Document</a>
            </div>
        </div>
        
        <div class="instructions">
            <h3>🎯 Quick Start</h3>
            <p>New to the project? Start with the <strong>Documentation Index</strong> for an overview, then explore the <strong>Architecture</strong> document to understand the system design.</p>
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(htmlDir, 'index.html'), indexHtml);

console.log('🎉 HTML documentation generation completed!');
console.log(`📁 HTML files are available in: ${htmlDir}`);
console.log(`🌐 Open docs/html/index.html in your browser to view all documentation`);
console.log('\n📋 Generated Documentation:');
docs.forEach(doc => {
    const exists = fs.existsSync(path.join(__dirname, doc.output));
    console.log(`   ${exists ? '✅' : '❌'} ${doc.title}`);
});

console.log('\n🎯 Next Steps:');
console.log('   1. Open docs/html/index.html in your browser');
console.log('   2. Click on any document to view it');
console.log('   3. Use browser print function (Ctrl+P / Cmd+P) to save as PDF');
console.log('   4. Share the documentation with your team');