import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './SlidePresentation.module.css';
// Import SVG files directly
import slide2SVG from '../assets/SVGs/slide2.svg';
import slide3SVG from '../assets/SVGs/slide3.svg';

// Total number of slides in the presentation
const TOTAL_SLIDES = 3;

const SlidePresentation = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // SVG content for each slide
  const renderSvgContent = () => {
    // Define animation variants for different elements
    const pathVariants = {
      hidden: { pathLength: 0, opacity: 0 },
      visible: { 
        pathLength: 1, 
        opacity: 1,
        transition: { 
          duration: 0.8, 
          ease: "easeInOut",
          delay: 0.1
        } 
      }
    };
    
    const circleVariants = {
      hidden: { pathLength: 0, opacity: 0 },
      visible: { 
        pathLength: 1, 
        opacity: 1,
        transition: { 
          duration: 1, 
          ease: "easeInOut" 
        } 
      }
    };
    
    // You can replace these with your own SVGs for each slide
    switch(currentSlide) {
      case 0:
        return (
          <motion.svg 
            width="500" 
            height="500" 
            viewBox="0 0 646 646" 
            initial="hidden"
            animate="visible"
            className={styles.svgContent}
          >
            {/* Grid lines - not animated */}
            <g opacity="0.3">
              {Array(16).fill().map((_, i) => (
                <motion.path 
                  key={`h-${i}`} 
                  d={`M0 ${66 + i*40}H679`} 
                  stroke="#4D4D4D"
                />
              ))}
              {Array(16).fill().map((_, i) => (
                <motion.path 
                  key={`v-${i}`} 
                  d={`M${19 + i*40} 0L${19 + i*40} 679`} 
                  stroke="#4D4D4D"
                />
              ))}
            </g>
            
            {/* Animated white lines */}
            <motion.path 
              d="M258 346L418 346" 
              stroke="white" 
              strokeWidth="4"
              variants={pathVariants}
            />
            <motion.path 
              d="M418 265.5L259 426.5M418 426.5L259 265.5M340 426.5V505H259L340 426.5ZM340 426.5V265.5M340 265.5V185.5H418L340 265.5Z" 
              stroke="white" 
              strokeWidth="4"
              variants={pathVariants}
            />
            <motion.circle 
              cx="337" 
              cy="347" 
              r="239" 
              stroke="white" 
              strokeWidth="4"
              fill="none"
              variants={circleVariants}
            />
          </motion.svg>
        );
      case 1:
        // For slide 2, we'll use the existing SVG file but animate it with Framer Motion
        return (
          <div className={styles.svgContent}>
            <div className={styles.instructionBox}>
              <div className={styles.instructionText}>play a note</div>
              <div className={styles.instructionExample}>ex C</div>
            </div>
            <motion.object
              type="image/svg+xml"
              data={slide2SVG}
              className={styles.svgObject}
              width="500"
              height="500"
              aria-label="Slide 2 SVG"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { duration: 0.5 }
              }}
              onLoad={(e) => {
                // After the SVG loads, we can access its document to animate elements
                const svgDoc = e.target.contentDocument;
                if (!svgDoc) return;
                
                // Find all paths in the SVG
                const paths = svgDoc.querySelectorAll('path');
                
                // Apply the animation to each path
                paths.forEach((path, index) => {
                  const length = path.getTotalLength();
                  
                  // Set initial state (invisible path)
                  path.style.strokeDasharray = length;
                  path.style.strokeDashoffset = length;
                  
                  // Animate with delay based on index
                  path.style.animation = `drawPath 0.8s ease-in-out ${index * 0.1}s forwards`;
                });
                
                // Add the keyframe animation to the SVG document
                const style = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");
                style.textContent = `
                  @keyframes drawPath {
                    to {
                      stroke-dashoffset: 0;
                    }
                  }
                `;
                svgDoc.querySelector('svg').appendChild(style);
              }}
            />
          </div>
        );
      case 2:
        // For slide 3, we'll use the existing SVG file with Framer Motion animations
        return (
          <div className={styles.svgContent}>
            <motion.div
              className={styles.instructionBox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className={styles.instructionText}>connect the notes</div>
              <div className={styles.instructionExample}>ex C to G</div>
            </motion.div>
            <motion.object
              type="image/svg+xml"
              data={slide3SVG}
              className={styles.svgObject}
              width="500"
              height="500"
              aria-label="Slide 3 SVG"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 0.5,
                transition: { duration: 0.5 }
              }}
              onLoad={(e) => {
                // After the SVG loads, we can access its document to animate elements
                const svgDoc = e.target.contentDocument;
                if (!svgDoc) return;
                
                // Find all paths and circles in the SVG
                const paths = svgDoc.querySelectorAll('path');
                const circles = svgDoc.querySelectorAll('circle');
                
                // Apply the animation to each path with staggered delay
                paths.forEach((path, index) => {
                  const length = path.getTotalLength();
                  
                  // Set initial state (invisible path)
                  path.style.strokeDasharray = length;
                  path.style.strokeDashoffset = length;
                  
                  // Animate with delay based on index
                  path.style.animation = `drawPath 0.8s ease-in-out ${index * 0.08}s forwards`;
                });
                
                // Apply animation to circles
                circles.forEach((circle, index) => {
                  const radius = parseFloat(circle.getAttribute('r'));
                  const circumference = 2 * Math.PI * radius;
                  
                  // Set initial state
                  circle.style.strokeDasharray = circumference;
                  circle.style.strokeDashoffset = circumference;
                  
                  // Animate with delay
                  circle.style.animation = `drawPath 0.7s ease-in-out ${paths.length * 0.08 + index * 0.1}s forwards`;
                });
                
                // Add the keyframe animation to the SVG document
                const style = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");
                style.textContent = `
                  @keyframes drawPath {
                    to {
                      stroke-dashoffset: 0;
                    }
                  }
                `;
                svgDoc.querySelector('svg').appendChild(style);
              }}
            />
          </div>
        );
      // Default case
      default:
        return null;
    }
  };
  
  // Implement infinite scrolling for slides
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % TOTAL_SLIDES);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
  };

  return (
    <div className={styles.slidePresentation}>
      <div className={styles.slideControls}>
        <button 
          className={`${styles.slideControlButton} ${styles.prevButton}`}
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <span className={styles.arrowLeft}></span>
        </button>
        <div className={styles.slideIndicator}>
          {currentSlide + 1} / {TOTAL_SLIDES}
        </div>
        <button 
          className={`${styles.slideControlButton} ${styles.nextButton}`}
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <span className={styles.arrowRight}></span>
        </button>
        <button className={styles.slideCloseButton} onClick={onClose} aria-label="Close presentation">
          <span className={styles.closeX}></span>
        </button>
      </div>
      
      <div className={styles.slideContent}>
        <div className={styles.slide}>
          
          <div className={styles.svgContainer}>
            {/* SVG content with animated lines */}
            <div className={styles.svgContent} key={`svg-${currentSlide}`}>
              {renderSvgContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidePresentation;
