import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  'Interior Design',
  'Custom Furniture',
  'Space Planning',
  'Lighting Design',
  'Renovation',
  'Other',
];

const CONTACT_DISPLAY_EMAIL = import.meta.env.VITE_CONTACT_DISPLAY_EMAIL || 'info@aurapeakwoodcraft.com';

interface FormState {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  website: string; // Honeypot field
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
}

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    website: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current?.children ?? [], {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      gsap.from(formRef.current?.children ?? [], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 80%',
        },
      });
    });
    return () => ctx.revert();
  }, []);

  // Form field change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error message when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Field validation helper
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required.';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email format.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required.';
    } else if (formData.phone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid phone number (at least 7 characters).';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service option.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Project Details or Message is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cooldown > 0) {
      setErrorMessage(`Please wait ${cooldown} seconds before submitting again.`);
      setSubmitStatus('error');
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: '',
          website: '',
        });
        setCooldown(60); // 60 seconds submit rate-limit / cooldown
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to send inquiry. Please try again.');
      }
    } catch (err: any) {
      setSubmitStatus('error');
      setErrorMessage('A network error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <div className="contact-grid">
        
        {/* Left Side: Brand Aesthetics & Info */}
        <div className="contact-info" ref={titleRef}>
          <p className="contact-label">Get in Touch</p>
          <h2 className="contact-title">
            Let's build something<br />
            <span className="serif-font" style={{ color: '#D4B16A', fontStyle: 'italic' }}>extraordinary</span> together.
          </h2>
          <p className="contact-desc">
            Whether you have a fully-formed design concept or are just beginning to explore your project's possibilities, our design team is ready to assist. Contact us to discuss your vision.
          </p>

          <div className="contact-details">
            <div className="detail-item">
              <span className="detail-icon">✉</span>
              <div>
                <p className="detail-title">Email Us</p>
                <a href={`mailto:${CONTACT_DISPLAY_EMAIL}`} className="detail-value">{CONTACT_DISPLAY_EMAIL}</a>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">✦</span>
              <div>
                <p className="detail-title">AuraPeak Studio</p>
                <p className="detail-value" style={{ margin: 0 }}>Luxury Woodcraft & Architectural Design</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="contact-form-container">
          {submitStatus === 'success' ? (
            <div className="success-wrapper">
              <div className="success-animation">
                <svg viewBox="0 0 52 52" className="checkmark">
                  <circle cx="26" cy="26" r="25" fill="none" className="checkmark-circle" />
                  <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="checkmark-check" />
                </svg>
              </div>
              <h3 className="success-title">Message Sent</h3>
              <p className="success-text">
                Thank you for contacting AuraPeak Woodcraft.<br />Our team will get back to you shortly.
              </p>
              <button 
                onClick={() => setSubmitStatus('idle')}
                className="btn-gold"
                style={{ marginTop: '24px', padding: '12px 28px' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="contact-form" noValidate>
              
              {/* Bot Honeypot Field */}
              <div className="honeypot-container" aria-hidden="true">
                <label htmlFor="website">Leave this field blank if you are a human:</label>
                <input 
                  type="text" 
                  id="website" 
                  name="website" 
                  value={formData.website} 
                  onChange={handleChange}
                  tabIndex={-1} 
                  autoComplete="off"
                />
              </div>

              {/* Name Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Phone Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              {/* Service Required Dropdown */}
              <div className="form-group">
                <label className="form-label" htmlFor="service">Service Required *</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`form-input form-select ${errors.service ? 'form-input-error' : ''}`}
                  disabled={isSubmitting}
                >
                  <option value="" disabled>Select a service...</option>
                  {SERVICES.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.service && <span className="error-message">{errors.service}</span>}
              </div>

              {/* Message Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="message">Project Details / Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your design needs, space layout, or furniture vision..."
                  rows={4}
                  className={`form-input form-textarea ${errors.message ? 'form-input-error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              {/* Submit Error Output */}
              {submitStatus === 'error' && (
                <div className="form-error-banner">
                  <span className="error-icon">⚠️</span>
                  <p className="error-text">{errorMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-gold submit-btn ${isSubmitting ? 'btn-submitting' : ''}`}
                style={{ width: '100%', minHeight: '52px', marginTop: '10px' }}
              >
                {isSubmitting ? (
                  <span className="spinner-wrapper">
                    <span className="submitting-spinner" />
                    Processing Request...
                  </span>
                ) : cooldown > 0 ? (
                  `Submitted (Cooldown ${cooldown}s)`
                ) : (
                  <>Submit Inquiry <span className="arrow" style={{ marginLeft: '6px' }}>→</span></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .contact-section {
          background-color: #0b0b0b;
          border-top: 1px solid rgba(212, 177, 106, 0.1);
          border-bottom: 1px solid rgba(212, 177, 106, 0.1);
          color: var(--color-white);
          padding: 120px 8%;
          position: relative;
          overflow: hidden;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 80px;
          max-width: 1300px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .contact-label {
          font-family: var(--font-sans);
          font-size: clamp(10px, 1.2vw, 11px);
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #D4B16A;
          margin-bottom: 20px;
        }

        .contact-title {
          font-family: var(--font-serif);
          font-weight: 300;
          font-size: clamp(2rem, 4vw, 3.8rem);
          line-height: 1.1;
          color: var(--color-white);
          margin-bottom: 24px;
        }

        .contact-desc {
          font-family: var(--font-sans);
          font-size: clamp(14px, 1.2vw, 16px);
          line-height: 1.8;
          color: var(--color-gray);
          margin-bottom: 40px;
          max-width: 500px;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .detail-icon {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(212, 177, 106, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D4B16A;
          font-size: 18px;
          background: rgba(212, 177, 106, 0.02);
        }

        .detail-title {
          font-family: var(--font-sans);
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--color-gray);
          margin: 0 0 4px 0;
        }

        .detail-value {
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--color-white);
          text-decoration: none;
          transition: color 0.3s;
        }

        a.detail-value:hover {
          color: #D4B16A;
        }

        .contact-form-container {
          background: #111111;
          border: 1px solid rgba(212, 177, 106, 0.15);
          border-radius: 8px;
          padding: 48px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          position: relative;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .honeypot-container {
          display: none;
          visibility: hidden;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
        }

        .form-label {
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #D4B16A;
          font-weight: 500;
        }

        .form-input {
          background-color: #0b0b0b;
          border: 1px solid rgba(212, 177, 106, 0.15);
          border-radius: 4px;
          color: var(--color-white);
          padding: 14px 18px;
          font-family: var(--font-sans);
          font-size: 14px;
          transition: border-color 0.3s, box-shadow 0.3s;
          outline: none;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }

        .form-input:focus {
          border-color: #D4B16A;
          box-shadow: 0 0 10px rgba(212, 177, 106, 0.15);
        }

        .form-input-error {
          border-color: #e57373 !important;
        }

        .form-select {
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23D4B16A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 18px center;
          padding-right: 48px;
        }

        .form-select option {
          background-color: #111111;
          color: var(--color-white);
        }

        .form-textarea {
          resize: vertical;
        }

        .error-message {
          font-family: var(--font-sans);
          font-size: 11px;
          color: #e57373;
          margin-top: 2px;
        }

        .form-error-banner {
          background: rgba(229, 115, 115, 0.1);
          border: 1px solid rgba(229, 115, 115, 0.2);
          border-radius: 4px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .error-icon {
          font-size: 16px;
        }

        .error-text {
          font-family: var(--font-sans);
          font-size: 13px;
          color: #e57373;
          margin: 0;
          line-height: 1.4;
        }

        .submit-btn {
          cursor: pointer;
          font-weight: 500;
          transition: color 0.3s, border-color 0.3s, background-color 0.3s;
        }

        .submit-btn:disabled {
          border-color: rgba(212, 177, 106, 0.3) !important;
          color: rgba(255, 255, 255, 0.4) !important;
          cursor: not-allowed;
          box-shadow: none !important;
        }

        .btn-submitting::before {
          display: none !important;
        }

        .spinner-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .submitting-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: #D4B16A;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Success Overlay Screen */
        .success-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          min-height: 400px;
          animation: fadeIn 0.6s ease-out forwards;
        }

        .success-title {
          font-family: var(--font-serif);
          font-size: 28px;
          font-weight: 300;
          color: #D4B16A;
          margin: 24px 0 12px 0;
          letter-spacing: 1px;
        }

        .success-text {
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.6;
          color: var(--color-gray);
          margin: 0;
        }

        /* Premium checkmark animation */
        .success-animation {
          margin: 20px auto;
        }

        .checkmark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #D4B16A;
          stroke-miterlimit: 10;
          box-shadow: inset 0px 0px 0px #D4B16A;
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
        }

        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke: #D4B16A;
          fill: none;
          animation: stroke .6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke .3s cubic-bezier(0.65, 0, 0.45, 1) .8s forwards;
        }

        @keyframes stroke {
          100% { stroke-dashoffset: 0; }
        }

        @keyframes fill {
          100% { box-shadow: inset 0px 0px 0px 40px rgba(212, 177, 106, 0.05); }
        }

        @keyframes scale {
          0%, 100% { transform: none; }
          50% { transform: scale3d(1.1, 1.1, 1); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive Layouts */
        @media (max-width: 1024px) {
          .contact-section {
            padding: 80px 5%;
          }
          
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 60px;
          }

          .contact-info {
            text-align: center;
            align-items: center;
          }

          .contact-desc {
            max-width: 600px;
          }

          .contact-details {
            flex-direction: row;
            justify-content: center;
            gap: 48px;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 768px) {
          .contact-form-container {
            padding: 32px;
          }

          .contact-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            width: fit-content;
            margin: 0 auto;
          }
        }

        @media (max-width: 480px) {
          .contact-form-container {
            padding: 24px 16px;
          }
        }
      `}</style>
    </section>
  );
};
