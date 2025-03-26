import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, faPhoneAlt, faGlobe, faClock, 
  faHandHoldingHeart, faComments, faHeart, faHandshake
} from '@fortawesome/free-solid-svg-icons';

const ContactUs = () => {
  const helplines = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7, free and confidential support for people in distress",
      icon: faPhone,
      website: "https://988lifeline.org/",
      hours: "24/7"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Free, 24/7 text support with a crisis counselor",
      icon: faComments,
      website: "https://www.crisistextline.org/",
      hours: "24/7"
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-HELP (4357)",
      description: "Free, confidential treatment referral and information service",
      icon: faHandHoldingHeart,
      website: "https://www.samhsa.gov/find-help/national-helpline",
      hours: "24/7"
    },
    {
      name: "National Alliance on Mental Illness (NAMI)",
      number: "1-800-950-NAMI (6264)",
      description: "Information, referrals, and support for mental health conditions",
      icon: faPhoneAlt,
      website: "https://www.nami.org/help",
      hours: "Mon-Fri, 10am-10pm ET"
    },
    {
      name: "The Trevor Project",
      number: "1-866-488-7386",
      description: "24/7 crisis intervention and suicide prevention for LGBTQ+ youth",
      icon: faHeart,
      website: "https://www.thetrevorproject.org/",
      hours: "24/7"
    },
    {
      name: "Veterans Crisis Line",
      number: "988, then press 1",
      description: "Confidential support for veterans, service members, and their families",
      icon: faHandshake,
      website: "https://www.veteranscrisisline.net/",
      hours: "24/7"
    }
  ];

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Emergency Helpline Numbers</h1>
        <p>If you're in crisis or need immediate help, please call one of these helplines</p>
      </div>

      <div className="helpline-grid">
        {helplines.map((helpline, index) => (
          <div key={index} className="helpline-card">
            <div className="helpline-icon">
              <FontAwesomeIcon icon={helpline.icon} />
            </div>
            <div className="helpline-content">
              <h3>{helpline.name}</h3>
              <div className="helpline-number">
                <FontAwesomeIcon icon={faPhone} />
                <span>{helpline.number}</span>
              </div>
              <p className="helpline-description">{helpline.description}</p>
              <div className="helpline-details">
                <div className="helpline-hours">
                  <FontAwesomeIcon icon={faClock} />
                  <span>{helpline.hours}</span>
                </div>
                <a 
                  href={helpline.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="helpline-website"
                >
                  <FontAwesomeIcon icon={faGlobe} />
                  Visit Website
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="emergency-notice">
        <h2>Important Notice</h2>
        <p>
          If you are experiencing a life-threatening emergency, please call 911 immediately.
          These helplines are for support and guidance, but emergency situations require immediate medical attention.
        </p>
      </div>
    </div>
  );
};

export default ContactUs; 