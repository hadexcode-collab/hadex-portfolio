import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const outPath = path.resolve(process.cwd(), 'public/resume.pdf');

// Create document with standard Letter size and 48pt (0.66 in) margins
const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: 46, bottom: 46, left: 50, right: 50 },
  autoFirstPage: true,
  info: {
    Title: 'Avinash TT - Resume',
    Author: 'Avinash TT',
    Subject: 'Software Development Engineer / Machine Learning Resume',
    Keywords: 'Avinash TT, Resume, Software Engineer, Machine Learning, Full-Stack, Autonomous Systems'
  }
});

const writeStream = fs.createWriteStream(outPath);
doc.pipe(writeStream);

const FONT_REG = 'Helvetica';
const FONT_BOLD = 'Helvetica-Bold';
const FONT_OBLIQUE = 'Helvetica-Oblique';

const PAGE_WIDTH = doc.page.width;
const LEFT = 50;
const RIGHT = PAGE_WIDTH - 50;
const CONTENT_WIDTH = RIGHT - LEFT;

function sectionHeader(title: string) {
  doc.moveDown(0.75);
  doc.font(FONT_BOLD).fontSize(11).fillColor('#000000').text(title, LEFT, doc.y);
  const lineY = doc.y + 2;
  doc.lineWidth(0.75).strokeColor('#222222').moveTo(LEFT, lineY).lineTo(RIGHT, lineY).stroke();
  doc.y = lineY + 6;
}

function bulletItem(text: string, boldPrefix?: string) {
  const startY = doc.y;
  doc.font(FONT_REG).fontSize(9.5).fillColor('#000000');
  doc.text('•', LEFT + 6, startY, { width: 12, lineGap: 2 });
  
  if (boldPrefix) {
    doc.font(FONT_BOLD).text(boldPrefix, LEFT + 18, startY, { continued: true, width: CONTENT_WIDTH - 18, lineGap: 2 });
    doc.font(FONT_REG).text(text, { lineGap: 2 });
  } else {
    doc.font(FONT_REG).text(text, LEFT + 18, startY, { width: CONTENT_WIDTH - 18, lineGap: 2 });
  }
  doc.moveDown(0.25);
}

// -------------------------------------------------------------
// PAGE 1
// -------------------------------------------------------------

// Name Header
doc.font(FONT_BOLD).fontSize(22).fillColor('#000000').text('AVINASH TT', { align: 'center' });
doc.moveDown(0.2);

// Subheaders
doc.font(FONT_REG).fontSize(9.5).fillColor('#111111');
doc.text('Chennai, Tamil Nadu, India • hadex.code@gmail.com', { align: 'center' });
doc.moveDown(0.1);
doc.text('linkedin.com/in/hadex • github.com/hadexcode-collab', { align: 'center' });

// PROFESSIONAL SUMMARY
sectionHeader('PROFESSIONAL SUMMARY');
doc.font(FONT_REG).fontSize(9.5).fillColor('#111111').text(
  'Results-driven Computer Science & Engineering undergraduate with hands-on experience in full-stack software development, distributed edge computing, artificial intelligence, and autonomous system architecture. Proven ability to design end-to-end scalable applications, optimize backend performance, and integrate complex hardware-software platforms. Adept at leveraging data structures, algorithmic problem solving, and modern development tools to solve complex, real-world problems. Seeking a Software Development Engineer (SDE) or Machine Learning role to leverage expertise in AI, backend performance, and scalable system architecture.',
  LEFT,
  doc.y,
  { width: CONTENT_WIDTH, align: 'left', lineGap: 2.5 }
);

// TECHNICAL SKILLS
sectionHeader('TECHNICAL SKILLS');

function skillRow(label: string, items: string) {
  const currentY = doc.y;
  doc.font(FONT_BOLD).fontSize(9.5).fillColor('#000000').text(label, LEFT, currentY, { continued: true, lineGap: 2 });
  doc.font(FONT_REG).fontSize(9.5).fillColor('#111111').text(' ' + items, { lineGap: 2 });
  doc.moveDown(0.15);
}

skillRow('Programming:', 'Python, Java, C++, SQL, JavaScript');
skillRow('AI/ML & Vision:', 'TensorFlow, PyTorch, OpenCV, Scikit-learn, Whisper AI, Computer Vision');
skillRow('Web & Frameworks:', 'FastAPI, Flask, Vite, Tailwind CSS, REST APIs');
skillRow('Tools & DevOps:', 'Git, GitHub, Docker, Pydantic, Linux/Unix');
skillRow('Systems & Hardware:', 'Microservices, Embedded Systems (ESP32, LoRa SX1278), Autonomous Systems, Edge Computing, Jetson Nano, LiDAR');
skillRow('Spoken Languages:', 'English, Tamil, Hindi, Telugu');

// PROJECT EXPERIENCE
sectionHeader('PROJECT EXPERIENCE');

// Project 1
doc.font(FONT_BOLD).fontSize(10).fillColor('#000000').text('ASCEND - GPS-Free Autonomous Drone System | ISRO IROC-U 2026', LEFT, doc.y);
doc.moveDown(0.2);
bulletItem('Architected autonomous perception and state estimation algorithms enabling high-precision navigation and docking in GPS-denied environments without human intervention.');
bulletItem('Integrated real-time computer vision models with embedded flight controllers (Pixhawk V6) and hardware payloads including Jetson Nano and LiDAR, achieving low-latency edge inference for obstacle avoidance.');
bulletItem('Led end-to-end hardware-software system integration and 3D CAD modeling documentation; team successfully qualified for Round 2 in the national ISRO Robotics Challenge.');

doc.moveDown(0.35);

// Project 2
doc.font(FONT_BOLD).fontSize(10).fillColor('#000000').text('THADAM / THADAM2 - AI Digital Preservation Platform | Smart India Hackathon', LEFT, doc.y);
doc.moveDown(0.2);
bulletItem('Engineered an automated archival processing pipeline using Python to ingest, index, and transform unstructured historical multimedia into structured, searchable data formats.');
bulletItem('Integrated Whisper AI and OpenCV models for high-accuracy speech-to-text transcription and video frame analysis, reducing manual data-curation effort.');
bulletItem('Designed a modular, scalable software architecture that streamlined search queries and multimedia data retrieval, optimizing models and migrating legacy logic.');

doc.moveDown(0.35);

// Project 3
doc.font(FONT_BOLD).fontSize(10).fillColor('#000000').text('Kalakitchen - Video-to-Recipe AI Assistant', LEFT, doc.y);
doc.moveDown(0.2);
bulletItem('Engineered a centralized machine learning pipeline to process cooking video inputs, utilizing advanced audio and image recognition techniques.');
bulletItem('Developed robust models to automatically extract complete ingredient lists and step-by-step cooking instructions directly from raw multimedia.');

// -------------------------------------------------------------
// PAGE 2
// -------------------------------------------------------------
doc.addPage({
  size: 'LETTER',
  margins: { top: 46, bottom: 46, left: 50, right: 50 }
});

// Project 4 (SafeRoute continuation of projects)
doc.font(FONT_BOLD).fontSize(10).fillColor('#000000').text('SafeRoute - AI-Assisted Emergency Response Platform | Emergency Response Tech', LEFT, doc.y);
doc.moveDown(0.2);
bulletItem('Designed a resilient emergency routing system tailored for zero-connectivity and disaster scenarios.');
bulletItem('Implemented long-range mesh communication protocols using LoRa SX1278 and Meshtastic modules on ESP32 microcontrollers to reliably transmit critical location data without cellular networks.');
bulletItem('Developed full-stack data ingestion logic to merge hardware payload signals into a unified tracking dashboard.');

// CERTIFICATIONS & PROFESSIONAL LEARNING
sectionHeader('CERTIFICATIONS & PROFESSIONAL LEARNING');
bulletItem('Software Conceptual Design - Elite Certification (Score: 70/100)', 'NPTEL: ');
bulletItem('Certificate of Completion (Nov 2025)', 'Tata ESG Virtual Experience (Forage): ');
bulletItem('Certificate of Completion (Jun 2025)', 'Deloitte Data Analytics Virtual Experience (Forage): ');
bulletItem('Round 1 Online Assessment & Coding Participant (Jul 2025)', 'Adobe India Hackathon: ');

// ACHIEVEMENTS
sectionHeader('ACHIEVEMENTS');
bulletItem('Recognized for engineering the ASCEND GPS-free autonomous drone system.', 'National Qualifier (Round 2) - ISRO Robotics Challenge (IROC-U 2026): ');
bulletItem('Selected among top national candidates for THADAM, an AI-driven digital preservation solution.', 'National Finalist - Smart India Hackathon: ');

// EDUCATION
sectionHeader('EDUCATION');
doc.font(FONT_BOLD).fontSize(10).fillColor('#000000').text('Sathyabama Institute of Science and Technology, Chennai, India', LEFT, doc.y);
doc.moveDown(0.15);
doc.font(FONT_REG).fontSize(9.5).fillColor('#111111').text('Bachelor of Engineering (B.E.) in Computer Science and Engineering | CGPA: 7.80/10.0', LEFT, doc.y);

doc.end();

writeStream.on('finish', () => {
  console.log('PDF generated successfully at:', outPath);
});
