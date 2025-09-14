#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Documentation files to convert
const docs = [
  {
    input: 'docs/README.md',
    output: 'docs/pdf/README.pdf',
    title: 'RBAC Application Documentation Index'
  },
  {
    input: 'docs/ARCHITECTURE.md',
    output: 'docs/pdf/ARCHITECTURE.pdf',
    title: 'RBAC Application Architecture Documentation'
  },
  {
    input: 'docs/DATA_FLOW.md',
    output: 'docs/pdf/DATA_FLOW.pdf',
    title: 'RBAC Application Data Flow Documentation'
  },
  {
    input: 'docs/COMPONENTS.md',
    output: 'docs/pdf/COMPONENTS.pdf',
    title: 'RBAC Application Components Documentation'
  },
  {
    input: 'docs/API_DOCUMENTATION.md',
    output: 'docs/pdf/API_DOCUMENTATION.pdf',
    title: 'RBAC Application API Documentation'
  },
  {
    input: 'docs/DEPLOYMENT_GUIDE.md',
    output: 'docs/pdf/DEPLOYMENT_GUIDE.pdf',
    title: 'RBAC Application Deployment Guide'
  },
  {
    input: 'docs/TESTING_GUIDE.md',
    output: 'docs/pdf/TESTING_GUIDE.pdf',
    title: 'RBAC Application Testing Guide'
  }
];

// Create PDF output directory
const pdfDir = path.join(__dirname, 'docs', 'pdf');
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

console.log('🚀 Starting PDF generation...\n');

// Check if pandoc is installed
try {
  execSync('pandoc --version', { stdio: 'ignore' });
  console.log('✅ Pandoc is installed\n');
} catch (error) {
  console.log('❌ Pandoc is not installed. Please install it first:');
  console.log('   macOS: brew install pandoc');
  console.log('   Ubuntu: sudo apt-get install pandoc');
  console.log('   Windows: Download from https://pandoc.org/installing.html\n');
  process.exit(1);
}

// Generate PDFs
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
    
    // Generate PDF using pandoc
    const command = `pandoc "${inputPath}" -o "${outputPath}" --pdf-engine=wkhtmltopdf --css=docs/styles/pdf.css --metadata title="${doc.title}" --toc --toc-depth=3`;
    
    execSync(command, { stdio: 'pipe' });
    
    console.log(`✅ Generated: ${doc.output}\n`);
  } catch (error) {
    console.log(`❌ Error generating ${doc.title}:`);
    console.log(`   ${error.message}\n`);
  }
});

console.log('🎉 PDF generation completed!');
console.log(`📁 PDF files are available in: ${pdfDir}`);

// Create a combined PDF if all individual PDFs were generated successfully
const allPdfsExist = docs.every(doc => fs.existsSync(path.join(__dirname, doc.output)));

if (allPdfsExist) {
  try {
    console.log('\n📚 Creating combined documentation PDF...');
    
    const combinedOutput = path.join(__dirname, 'docs', 'pdf', 'RBAC_Application_Complete_Documentation.pdf');
    const pdfFiles = docs.map(doc => path.join(__dirname, doc.output)).join(' ');
    
    // Use pdftk to combine PDFs (if available)
    try {
      execSync(`pdftk ${pdfFiles} cat output "${combinedOutput}"`, { stdio: 'pipe' });
      console.log(`✅ Combined PDF created: ${combinedOutput}`);
    } catch (pdftkError) {
      console.log('ℹ️  pdftk not available for combining PDFs. Individual PDFs are ready.');
    }
  } catch (error) {
    console.log('❌ Error creating combined PDF:', error.message);
  }
}

console.log('\n📋 Generated Documentation:');
docs.forEach(doc => {
  const exists = fs.existsSync(path.join(__dirname, doc.output));
  console.log(`   ${exists ? '✅' : '❌'} ${doc.title}`);
});

console.log('\n🎯 Next Steps:');
console.log('   1. Review the generated PDF files');
console.log('   2. Share with your team or stakeholders');
console.log('   3. Update documentation as needed');
console.log('   4. Re-run this script to regenerate PDFs');
