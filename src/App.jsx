import { useState, useEffect, useRef } from "react";

// ─── Design Tokens ───────────────────────────────────────────────
// Palette: Deep Navy (#0A0F1E) · Electric Blue (#1E6FFF) · 
//          Ice White (#F0F4FF) · Slate (#8B95B0) · Accent Teal (#00D4FF)
// Type: Inter (utility/body) · system-ui for data labels
// Signature: Animated "circuit-pulse" lines in the hero that trace the shape 
//            of a document form — unique to a digital-services brand.

const SERVICES = [
  { id: 1, cat: "govt", icon: "🪪", name: "PAN Card Services", desc: "New PAN, corrections, reprint & linking", docs: ["Aadhaar Copy", "Photo", "Address Proof"], price: 149 },
  { id: 2, cat: "govt", icon: "📋", name: "Aadhaar Services", desc: "Update address, mobile, biometrics & more", docs: ["Existing Aadhaar", "Address Proof"], price: 99 },
  { id: 3, cat: "govt", icon: "🗳️", name: "Voter ID Services", desc: "New registration, corrections & download", docs: ["Age Proof", "Address Proof", "Photo"], price: 99 },
  { id: 4, cat: "govt", icon: "🛂", name: "Passport Assistance", desc: "Fresh application, renewal & tracking", docs: ["Birth Certificate", "Aadhaar", "Photo"], price: 299 },
  { id: 5, cat: "govt", icon: "💰", name: "Income Tax Return (ITR)", desc: "Filing for salaried, freelancer & business", docs: ["Form 16", "PAN", "Bank Statement"], price: 499 },
  { id: 6, cat: "govt", icon: "📊", name: "GST Registration & Returns", desc: "New GST number, monthly & annual returns", docs: ["PAN", "Aadhaar", "Business Proof"], price: 599 },
  { id: 7, cat: "edu", icon: "📜", name: "Affidavit Services", desc: "Notarized affidavits for all purposes", docs: ["ID Proof", "Purpose Document"], price: 199 },
  { id: 8, cat: "edu", icon: "🏠", name: "Rent Agreement", desc: "Drafting & notarization of rent agreements", docs: ["Owner ID", "Tenant ID", "Property Details"], price: 249 },
  { id: 9, cat: "edu", icon: "📄", name: "Resume Making", desc: "ATS-optimized professional resume design", docs: ["Existing Resume / Details"], price: 199 },
  { id: 10, cat: "edu", icon: "🖊️", name: "Online Form Filling", desc: "Government & private form filling assistance", docs: ["Required Documents"], price: 79 },
  { id: 11, cat: "edu", icon: "📁", name: "Digital Documentation", desc: "Scanning, formatting & digital filing", docs: ["Physical Documents"], price: 99 },
];

const STEPS = [
  { icon: "🔍", label: "Select Service" },
  { icon: "📝", label: "Fill Details" },
  { icon: "📎", label: "Upload Docs" },
  { icon: "💳", label: "Pay Online" },
  { icon: "✅", label: "Get Delivery" },
];

const MOCK_ORDERS = [
  { id: "UT2024001", service: "PAN Card Services", status: "Completed", date: "12 Jun 2024", amount: 149 },
  { id: "UT2024002", service: "ITR Filing", status: "In Progress", date: "14 Jun 2024", amount: 499 },
  { id: "UT2024003", service: "Rent Agreement", status: "Pending", date: "15 Jun 2024", amount: 249 },
];

// ─── Utility ─────────────────────────────────────────────────────
const statusColor = (s) => s === "Completed" ? "#00C97A" : s === "In Progress" ? "#1E6FFF" : "#F59E0B";

// ─── Global Styles ───────────────────────────────────────────────
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', system-ui, sans-serif; background: #0A0F1E; color: #F0F4FF; line-height: 1.6; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0A0F1E; } ::-webkit-scrollbar-thumb { background: #1E6FFF; border-radius: 3px; }
  input, textarea, select { font-family: inherit; }
  button { cursor: pointer; font-family: inherit; }

  /* Nav */
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: rgba(10,15,30,0.92); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(30,111,255,0.15); padding: 0 5vw; display: flex; align-items: center; justify-content: space-between; height: 68px; }
  .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .nav-logo-icon { width: 38px; height: 38px; background: linear-gradient(135deg, #1E6FFF, #00D4FF); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; color: #fff; letter-spacing: -1px; }
  .nav-logo-text { font-size: 16px; font-weight: 700; color: #F0F4FF; line-height: 1.2; }
  .nav-logo-sub { font-size: 10px; color: #00D4FF; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; }
  .nav-links { display: flex; gap: 28px; list-style: none; }
  .nav-links a { color: #8B95B0; text-decoration: none; font-size: 14px; font-weight: 500; transition: color .2s; }
  .nav-links a:hover, .nav-links a.active { color: #F0F4FF; }
  .nav-cta { background: linear-gradient(135deg, #1E6FFF, #00D4FF); color: #fff; border: none; padding: 10px 22px; border-radius: 8px; font-size: 14px; font-weight: 600; transition: opacity .2s, transform .2s; }
  .nav-cta:hover { opacity: .9; transform: translateY(-1px); }
  .nav-hamburger { display: none; background: none; border: none; color: #F0F4FF; font-size: 22px; }
  .mobile-menu { display: none; position: fixed; top: 68px; left: 0; right: 0; background: #0D1526; border-bottom: 1px solid rgba(30,111,255,0.2); padding: 20px 5vw; flex-direction: column; gap: 16px; z-index: 999; }
  .mobile-menu.open { display: flex; }
  .mobile-menu a { color: #8B95B0; text-decoration: none; font-size: 15px; font-weight: 500; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }

  /* Hero */
  .hero { min-height: 100vh; display: flex; align-items: center; padding: 100px 5vw 80px; position: relative; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(30,111,255,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(0,212,255,0.07) 0%, transparent 60%); }
  .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(30,111,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(30,111,255,0.04) 1px, transparent 1px); background-size: 60px 60px; }
  .hero-content { position: relative; max-width: 660px; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(30,111,255,0.12); border: 1px solid rgba(30,111,255,0.3); border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 600; color: #00D4FF; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 28px; }
  .hero-badge::before { content: ''; width: 6px; height: 6px; background: #00D4FF; border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
  .hero-title { font-size: clamp(36px, 5.5vw, 64px); font-weight: 900; line-height: 1.08; letter-spacing: -2px; margin-bottom: 20px; }
  .hero-title span { background: linear-gradient(135deg, #1E6FFF, #00D4FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero-sub { font-size: 18px; color: #8B95B0; max-width: 520px; line-height: 1.7; margin-bottom: 36px; }
  .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 52px; }
  .btn-primary { background: linear-gradient(135deg, #1E6FFF, #00D4FF); color: #fff; border: none; padding: 15px 32px; border-radius: 10px; font-size: 15px; font-weight: 700; transition: transform .2s, box-shadow .2s; box-shadow: 0 4px 24px rgba(30,111,255,0.35); }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(30,111,255,0.5); }
  .btn-outline { background: transparent; color: #F0F4FF; border: 1px solid rgba(240,244,255,0.2); padding: 15px 32px; border-radius: 10px; font-size: 15px; font-weight: 600; transition: border-color .2s, background .2s; }
  .btn-outline:hover { border-color: #1E6FFF; background: rgba(30,111,255,0.08); }
  .hero-stats { display: flex; gap: 36px; }
  .stat { }
  .stat-num { font-size: 28px; font-weight: 800; color: #F0F4FF; letter-spacing: -1px; }
  .stat-label { font-size: 12px; color: #8B95B0; font-weight: 500; }
  .hero-visual { position: absolute; right: 5vw; top: 50%; transform: translateY(-50%); width: min(420px, 40vw); display: none; }

  /* Steps */
  .steps-bar { background: rgba(30,111,255,0.06); border-top: 1px solid rgba(30,111,255,0.1); border-bottom: 1px solid rgba(30,111,255,0.1); padding: 32px 5vw; }
  .steps-inner { max-width: 900px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 0; }
  .step-item { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; }
  .step-icon { width: 48px; height: 48px; background: rgba(30,111,255,0.12); border: 1px solid rgba(30,111,255,0.25); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .step-label { font-size: 11px; font-weight: 600; color: #8B95B0; text-align: center; letter-spacing: .3px; }
  .step-arrow { color: rgba(30,111,255,0.3); font-size: 18px; padding: 0 4px; margin-bottom: 22px; }

  /* Section */
  .section { padding: 88px 5vw; }
  .section-sm { padding: 56px 5vw; }
  .section-label { font-size: 11px; font-weight: 700; color: #1E6FFF; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
  .section-title { font-size: clamp(26px, 3.5vw, 42px); font-weight: 800; letter-spacing: -1px; line-height: 1.15; margin-bottom: 16px; }
  .section-sub { font-size: 16px; color: #8B95B0; max-width: 540px; line-height: 1.7; margin-bottom: 48px; }
  .center { text-align: center; }
  .center .section-sub { margin-left: auto; margin-right: auto; }

  /* Service Cards */
  .services-tabs { display: flex; gap: 10px; margin-bottom: 36px; flex-wrap: wrap; }
  .tab-btn { background: rgba(30,111,255,0.08); border: 1px solid rgba(30,111,255,0.2); color: #8B95B0; padding: 9px 22px; border-radius: 8px; font-size: 13px; font-weight: 600; transition: all .2s; }
  .tab-btn.active { background: linear-gradient(135deg, #1E6FFF, #00D4FF); color: #fff; border-color: transparent; }
  .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
  .service-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 24px; transition: border-color .2s, transform .2s, background .2s; cursor: pointer; }
  .service-card:hover { border-color: rgba(30,111,255,0.4); background: rgba(30,111,255,0.06); transform: translateY(-3px); }
  .service-card-icon { font-size: 28px; margin-bottom: 14px; }
  .service-card-name { font-size: 15px; font-weight: 700; margin-bottom: 6px; color: #F0F4FF; }
  .service-card-desc { font-size: 13px; color: #8B95B0; line-height: 1.6; margin-bottom: 18px; }
  .service-card-footer { display: flex; align-items: center; justify-content: space-between; }
  .service-price { font-size: 18px; font-weight: 800; color: #1E6FFF; }
  .service-price span { font-size: 11px; color: #8B95B0; font-weight: 500; }
  .btn-book { background: rgba(30,111,255,0.12); border: 1px solid rgba(30,111,255,0.3); color: #1E6FFF; padding: 8px 18px; border-radius: 7px; font-size: 13px; font-weight: 600; transition: all .2s; }
  .btn-book:hover { background: #1E6FFF; color: #fff; }

  /* Order Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(5,8,18,0.85); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: #0D1526; border: 1px solid rgba(30,111,255,0.2); border-radius: 20px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; }
  .modal-header { padding: 28px 28px 0; display: flex; justify-content: space-between; align-items: flex-start; }
  .modal-title { font-size: 20px; font-weight: 800; }
  .modal-close { background: none; border: none; color: #8B95B0; font-size: 22px; line-height: 1; padding: 4px; }
  .modal-close:hover { color: #F0F4FF; }
  .modal-body { padding: 24px 28px 28px; }
  .modal-steps { display: flex; gap: 4px; margin-bottom: 28px; }
  .modal-step-dot { flex: 1; height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px; transition: background .3s; }
  .modal-step-dot.done { background: linear-gradient(90deg, #1E6FFF, #00D4FF); }
  .form-group { margin-bottom: 18px; }
  .form-label { font-size: 12px; font-weight: 600; color: #8B95B0; letter-spacing: .5px; text-transform: uppercase; margin-bottom: 7px; display: block; }
  .form-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; padding: 12px 16px; color: #F0F4FF; font-size: 14px; outline: none; transition: border-color .2s; }
  .form-input:focus { border-color: #1E6FFF; }
  .form-input::placeholder { color: #4A5470; }
  .upload-zone { border: 2px dashed rgba(30,111,255,0.25); border-radius: 10px; padding: 32px; text-align: center; cursor: pointer; transition: border-color .2s, background .2s; }
  .upload-zone:hover { border-color: #1E6FFF; background: rgba(30,111,255,0.04); }
  .upload-zone-icon { font-size: 32px; margin-bottom: 10px; }
  .upload-zone-text { font-size: 14px; color: #8B95B0; }
  .upload-zone-sub { font-size: 12px; color: #4A5470; margin-top: 4px; }
  .docs-list { margin-bottom: 16px; }
  .doc-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #8B95B0; padding: 6px 0; }
  .doc-item::before { content: '•'; color: #1E6FFF; font-weight: 700; }
  .uploaded-file { display: flex; align-items: center; gap: 10px; background: rgba(0,201,122,0.08); border: 1px solid rgba(0,201,122,0.2); border-radius: 8px; padding: 10px 14px; margin-top: 10px; }
  .payment-methods { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .pay-method { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 14px; text-align: center; cursor: pointer; transition: all .2s; }
  .pay-method.selected { border-color: #1E6FFF; background: rgba(30,111,255,0.1); }
  .pay-method-icon { font-size: 22px; margin-bottom: 6px; }
  .pay-method-label { font-size: 12px; font-weight: 600; color: #8B95B0; }
  .order-summary { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 16px; margin-bottom: 20px; }
  .order-row { display: flex; justify-content: space-between; font-size: 13px; color: #8B95B0; padding: 5px 0; }
  .order-row.total { border-top: 1px solid rgba(255,255,255,0.07); margin-top: 8px; padding-top: 12px; font-size: 15px; font-weight: 700; color: #F0F4FF; }
  .modal-footer { display: flex; gap: 10px; }
  .btn-back { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #8B95B0; padding: 13px 22px; border-radius: 9px; font-size: 14px; font-weight: 600; }
  .btn-next { flex: 1; background: linear-gradient(135deg, #1E6FFF, #00D4FF); color: #fff; border: none; padding: 13px 22px; border-radius: 9px; font-size: 14px; font-weight: 700; transition: opacity .2s; }
  .btn-next:hover { opacity: .9; }
  .success-screen { text-align: center; padding: 20px 0; }
  .success-icon { font-size: 56px; margin-bottom: 16px; }
  .success-title { font-size: 22px; font-weight: 800; margin-bottom: 10px; }
  .success-sub { font-size: 14px; color: #8B95B0; line-height: 1.7; margin-bottom: 24px; }
  .order-id-badge { background: rgba(30,111,255,0.1); border: 1px solid rgba(30,111,255,0.25); border-radius: 8px; padding: 10px 20px; display: inline-block; font-size: 13px; font-weight: 700; color: #1E6FFF; letter-spacing: 1px; margin-bottom: 20px; }

  /* Dashboard */
  .dashboard { background: #080D1A; min-height: calc(100vh - 68px); padding: 40px 5vw; }
  .dash-header { margin-bottom: 36px; }
  .dash-title { font-size: 26px; font-weight: 800; margin-bottom: 4px; }
  .dash-sub { font-size: 14px; color: #8B95B0; }
  .dash-tabs { display: flex; gap: 6px; margin-bottom: 28px; border-bottom: 1px solid rgba(255,255,255,0.07); padding-bottom: 0; }
  .dash-tab { background: none; border: none; color: #8B95B0; font-size: 14px; font-weight: 600; padding: 10px 18px; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all .2s; }
  .dash-tab.active { color: #1E6FFF; border-bottom-color: #1E6FFF; }
  .orders-table { width: 100%; border-collapse: collapse; }
  .orders-table th { text-align: left; font-size: 11px; font-weight: 700; color: #4A5470; letter-spacing: 1px; text-transform: uppercase; padding: 12px 16px; background: rgba(255,255,255,0.02); }
  .orders-table td { padding: 14px 16px; font-size: 13px; color: #8B95B0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .orders-table td:first-child { color: #F0F4FF; font-weight: 600; font-size: 12px; }
  .status-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
  .dash-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .dash-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 20px; }
  .dash-card-label { font-size: 11px; font-weight: 600; color: #4A5470; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
  .dash-card-val { font-size: 26px; font-weight: 800; color: #F0F4FF; }
  .dash-card-sub { font-size: 12px; color: #8B95B0; margin-top: 3px; }

  /* Features */
  .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 18px; }
  .feature-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 24px; }
  .feature-icon { width: 44px; height: 44px; background: rgba(30,111,255,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 16px; }
  .feature-title { font-size: 15px; font-weight: 700; margin-bottom: 7px; }
  .feature-desc { font-size: 13px; color: #8B95B0; line-height: 1.6; }

  /* Testimonials */
  .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
  .testi-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 24px; }
  .testi-stars { color: #F59E0B; font-size: 14px; margin-bottom: 12px; }
  .testi-text { font-size: 14px; color: #8B95B0; line-height: 1.7; margin-bottom: 16px; font-style: italic; }
  .testi-name { font-size: 13px; font-weight: 700; color: #F0F4FF; }
  .testi-role { font-size: 11px; color: #4A5470; }

  /* WhatsApp FAB */
  .wa-fab { position: fixed; bottom: 28px; right: 28px; z-index: 900; background: #25D366; color: #fff; width: 56px; height: 56px; border-radius: 50%; border: none; font-size: 26px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(37,211,102,0.4); transition: transform .2s; }
  .wa-fab:hover { transform: scale(1.1); }

  /* Footer */
  .footer { background: #060A15; border-top: 1px solid rgba(255,255,255,0.06); padding: 56px 5vw 28px; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 48px; }
  .footer-brand p { font-size: 13px; color: #8B95B0; line-height: 1.7; margin-top: 14px; max-width: 280px; }
  .footer-col-title { font-size: 12px; font-weight: 700; color: #F0F4FF; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .footer-links a { color: #8B95B0; text-decoration: none; font-size: 13px; transition: color .2s; }
  .footer-links a:hover { color: #1E6FFF; }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: gap; }
  .footer-bottom p { font-size: 12px; color: #4A5470; }
  .footer-pay-icons { display: flex; gap: 8px; }
  .pay-icon-badge { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 5px; padding: 4px 9px; font-size: 11px; color: #8B95B0; font-weight: 600; }

  /* Contact/Visit */
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
  .contact-info { }
  .contact-item { display: flex; gap: 14px; margin-bottom: 20px; }
  .contact-item-icon { width: 42px; height: 42px; background: rgba(30,111,255,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .contact-item-label { font-size: 11px; color: #4A5470; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
  .contact-item-val { font-size: 14px; color: #F0F4FF; font-weight: 500; margin-top: 2px; }
  .map-placeholder { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; height: 280px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 10px; color: #4A5470; font-size: 14px; }
  .inquiry-form { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 28px; }

  /* Admin Panel */
  .admin-panel { background: #060A15; min-height: calc(100vh - 68px); padding: 40px 5vw; }
  .admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .admin-stat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 20px; }
  .admin-stat-icon { font-size: 24px; margin-bottom: 8px; }
  .admin-stat-val { font-size: 28px; font-weight: 800; color: #F0F4FF; }
  .admin-stat-label { font-size: 12px; color: #8B95B0; margin-top: 2px; }
  .select-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #F0F4FF; border-radius: 7px; padding: 7px 12px; font-size: 13px; outline: none; }
  .btn-sm { padding: 8px 16px; border-radius: 7px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; }
  .btn-blue { background: rgba(30,111,255,0.15); color: #1E6FFF; border: 1px solid rgba(30,111,255,0.3); }
  .btn-green { background: rgba(0,201,122,0.15); color: #00C97A; border: 1px solid rgba(0,201,122,0.3); }

  /* Divider */
  .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 0 5vw; }

  /* Notification toast */
  .toast { position: fixed; bottom: 100px; right: 28px; background: #0D1526; border: 1px solid rgba(30,111,255,0.3); border-radius: 12px; padding: 16px 20px; font-size: 14px; font-weight: 500; max-width: 300px; z-index: 3000; box-shadow: 0 8px 32px rgba(0,0,0,0.4); animation: slideIn .3s ease; }
  @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  /* Responsive */
  @media (max-width: 900px) {
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .hero-visual { display: none; }
    .contact-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .nav-links { display: none; }
    .nav-hamburger { display: block; }
    .footer-grid { grid-template-columns: 1fr; }
    .steps-inner { flex-wrap: wrap; gap: 12px; }
    .step-arrow { display: none; }
    .hero-stats { gap: 24px; }
    .modal { border-radius: 16px 16px 0 0; margin-top: auto; }
    .modal-overlay { align-items: flex-end; padding: 0; }
    .payment-methods { grid-template-columns: 1fr 1fr; }
    .dash-tab { font-size: 12px; padding: 8px 12px; }
    .orders-table { font-size: 12px; }
    .orders-table th, .orders-table td { padding: 10px 10px; }
  }
`;

// ─── Components ──────────────────────────────────────────────────

function Navbar({ page, setPage, mobileOpen, setMobileOpen }) {
  const links = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "dashboard", label: "My Orders" },
    { id: "contact", label: "Contact" },
  ];
  return (
    <>
      <nav className="nav">
        <a className="nav-logo" onClick={() => setPage("home")} style={{ cursor: "pointer" }}>
          <div className="nav-logo-icon">UT</div>
          <div>
            <div className="nav-logo-text">Universal Technologies</div>
            <div className="nav-logo-sub">Digital Service Portal</div>
          </div>
        </a>
        <ul className="nav-links">
          {links.map(l => (
            <li key={l.id}>
              <a onClick={() => setPage(l.id)} className={page === l.id ? "active" : ""} style={{ cursor: "pointer" }}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a onClick={() => setPage("admin")} style={{ cursor: "pointer", color: "#F59E0B" }}>Admin</a>
          </li>
        </ul>
        <button className="nav-cta" onClick={() => setPage("services")}>Book a Service</button>
        <button className="nav-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
      </nav>
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        {links.map(l => (
          <a key={l.id} onClick={() => { setPage(l.id); setMobileOpen(false); }} style={{ cursor: "pointer" }}>{l.label}</a>
        ))}
        <a onClick={() => { setPage("admin"); setMobileOpen(false); }} style={{ cursor: "pointer", color: "#F59E0B" }}>Admin Panel</a>
      </div>
    </>
  );
}

function Hero({ setPage }) {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="hero-content">
        <div className="hero-badge">🟢 Online Services Available 24/7</div>
        <h1 className="hero-title">
          Government &amp; Digital<br />
          <span>Services, Delivered</span><br />
          to Your Doorstep
        </h1>
        <p className="hero-sub">
          PAN Card, Aadhaar, ITR, GST, Passport, Voter ID and more — 
          apply online, upload documents, pay securely, and receive your 
          completed work on WhatsApp or email.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setPage("services")}>Browse Services →</button>
          <button className="btn-outline" onClick={() => setPage("dashboard")}>Track My Order</button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-num">2,400+</div>
            <div className="stat-label">Services Delivered</div>
          </div>
          <div className="stat">
            <div className="stat-num">11</div>
            <div className="stat-label">Service Categories</div>
          </div>
          <div className="stat">
            <div className="stat-num">24 hrs</div>
            <div className="stat-label">Avg. Turnaround</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepsBar() {
  return (
    <div className="steps-bar">
      <div className="steps-inner">
        {STEPS.map((s, i) => (
          <>
            <div className="step-item" key={s.label}>
              <div className="step-icon">{s.icon}</div>
              <div className="step-label">{s.label}</div>
            </div>
            {i < STEPS.length - 1 && <div className="step-arrow" key={`arr-${i}`}>›</div>}
          </>
        ))}
      </div>
    </div>
  );
}

// ─── Order Modal ─────────────────────────────────────────────────
function OrderModal({ service, onClose, onSuccess }) {
  const [step, setStep] = useState(0); // 0=details 1=upload 2=payment 3=success
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" });
  const [files, setFiles] = useState([]);
  const [payMethod, setPayMethod] = useState("upi");
  const [upi, setUpi] = useState("");
  const [orderId] = useState("UT" + Date.now().toString().slice(-6));
  const fileRef = useRef();

  const handleFile = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handlePay = () => {
    // Simulate payment success
    setTimeout(() => { setStep(3); onSuccess && onSuccess(orderId); }, 1200);
    setStep(2.5); // loading state
  };

  const METHODS = [
    { id: "upi", icon: "📱", label: "UPI / QR" },
    { id: "card", icon: "💳", label: "Card" },
    { id: "netbank", icon: "🏦", label: "Net Banking" },
    { id: "wallet", icon: "👜", label: "Wallet" },
  ];

  if (step === 3) return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-body">
          <div className="success-screen">
            <div className="success-icon">🎉</div>
            <h2 className="success-title">Order Placed Successfully!</h2>
            <p className="success-sub">
              Your payment is confirmed. We've received your documents and will process your <strong>{service.name}</strong> request within 24 hours.
            </p>
            <div className="order-id-badge">Order ID: {orderId}</div>
            <p className="success-sub">
              You'll receive updates on WhatsApp &amp; Email. Completed documents will be shared digitally.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <button className="btn-primary" onClick={onClose}>Done</button>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
                style={{ background: "#25D366", color: "#fff", border: "none", padding: "13px 22px", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 12, color: "#8B95B0", marginBottom: 4, fontWeight: 600 }}>
              {service.icon} {service.name}
            </div>
            <h2 className="modal-title">
              {step === 0 ? "Your Details" : step === 1 ? "Upload Documents" : "Payment"}
            </h2>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-steps">
            {[0, 1, 2].map(i => (
              <div key={i} className={`modal-step-dot ${i <= step ? "done" : ""}`} />
            ))}
          </div>

          {step === 0 && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="Your full name" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" placeholder="your@email.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Additional Note</label>
                <textarea className="form-input" rows={3} placeholder="Any specific instructions..."
                  value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} style={{ resize: "vertical" }} />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <p style={{ fontSize: 13, color: "#8B95B0", marginBottom: 16 }}>
                Please upload the required documents for <strong style={{ color: "#F0F4FF" }}>{service.name}</strong>:
              </p>
              <div className="docs-list">
                {service.docs.map(d => <div key={d} className="doc-item">{d}</div>)}
              </div>
              <div className="upload-zone" onClick={() => fileRef.current.click()}>
                <input type="file" multiple hidden ref={fileRef} onChange={handleFile}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                <div className="upload-zone-icon">📎</div>
                <div className="upload-zone-text">Click to upload documents</div>
                <div className="upload-zone-sub">PDF, JPG, PNG, DOC — Max 10MB each</div>
              </div>
              {files.map((f, i) => (
                <div key={i} className="uploaded-file">
                  <span>📄</span>
                  <span style={{ fontSize: 13, color: "#00C97A", flex: 1 }}>{f.name}</span>
                  <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                    style={{ background: "none", border: "none", color: "#8B95B0", cursor: "pointer" }}>✕</button>
                </div>
              ))}
            </>
          )}

          {step === 2 && (
            <>
              <div className="order-summary">
                <div className="order-row"><span>Service</span><span>{service.name}</span></div>
                <div className="order-row"><span>Customer</span><span>{form.name}</span></div>
                <div className="order-row"><span>Documents</span><span>{files.length} uploaded</span></div>
                <div className="order-row"><span>Processing Fee</span><span>₹{Math.round(service.price * 0.02)}</span></div>
                <div className="order-row total"><span>Total</span><span>₹{service.price + Math.round(service.price * 0.02)}</span></div>
              </div>
              <p style={{ fontSize: 12, color: "#8B95B0", marginBottom: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Select Payment Method</p>
              <div className="payment-methods">
                {METHODS.map(m => (
                  <div key={m.id} className={`pay-method ${payMethod === m.id ? "selected" : ""}`}
                    onClick={() => setPayMethod(m.id)}>
                    <div className="pay-method-icon">{m.icon}</div>
                    <div className="pay-method-label">{m.label}</div>
                  </div>
                ))}
              </div>
              {payMethod === "upi" && (
                <div className="form-group">
                  <label className="form-label">UPI ID</label>
                  <input className="form-input" placeholder="yourname@upi" value={upi}
                    onChange={e => setUpi(e.target.value)} />
                </div>
              )}
              {payMethod === "card" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">Expiry</label>
                      <input className="form-input" placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input className="form-input" placeholder="•••" maxLength={3} type="password" />
                    </div>
                  </div>
                </>
              )}
              <div style={{ fontSize: 11, color: "#4A5470", marginTop: 4, display: "flex", gap: 6, alignItems: "center" }}>
                🔒 Secured by Razorpay · SSL Encrypted · PCI DSS Compliant
              </div>
            </>
          )}

          <div className="modal-footer" style={{ marginTop: 20 }}>
            {step > 0 && <button className="btn-back" onClick={() => setStep(s => s - 1)}>← Back</button>}
            {step < 2 && (
              <button className="btn-next"
                onClick={() => {
                  if (step === 0 && (!form.name || !form.phone || !form.email)) return alert("Please fill all required fields.");
                  setStep(s => s + 1);
                }}>
                {step === 0 ? "Upload Documents →" : "Review & Pay →"}
              </button>
            )}
            {step === 2 && (
              <button className="btn-next" onClick={handlePay}>
                Pay ₹{service.price + Math.round(service.price * 0.02)} Securely →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pages ───────────────────────────────────────────────────────

function HomePage({ setPage, openService }) {
  return (
    <>
      <Hero setPage={setPage} />
      <StepsBar />

      {/* Features */}
      <section className="section">
        <div className="center">
          <p className="section-label">Why Universal Technologies</p>
          <h2 className="section-title">Everything handled online.<br />Nothing lost in transit.</h2>
          <p className="section-sub">From application to delivery — your documents never leave our secure system until they're ready for you.</p>
        </div>
        <div className="features-grid">
          {[
            { icon: "💳", title: "Secure Online Payment", desc: "UPI, Cards, Net Banking & Wallets via Razorpay. Every transaction is encrypted and confirmed instantly." },
            { icon: "📎", title: "Document Upload System", desc: "Upload your documents directly in the portal. No email attachments, no physical visits required." },
            { icon: "📱", title: "WhatsApp Delivery", desc: "Completed documents are delivered to your WhatsApp or email. Fast, convenient, and trackable." },
            { icon: "📊", title: "Real-Time Order Tracking", desc: "Know exactly where your application stands — Pending, In Progress, or Completed." },
            { icon: "🛡️", title: "SSL Secured Portal", desc: "256-bit encryption on all data. Your Aadhaar, PAN, and personal details are protected at every step." },
            { icon: "⚡", title: "24-Hour Turnaround", desc: "Most services are completed within 24 hours. Express processing available for urgent needs." },
          ].map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* Popular Services Preview */}
      <section className="section">
        <p className="section-label">Popular Services</p>
        <h2 className="section-title">Most requested this month</h2>
        <p className="section-sub">Tap any service to start your online application in under 3 minutes.</p>
        <div className="services-grid">
          {SERVICES.slice(0, 6).map(s => (
            <div className="service-card" key={s.id}>
              <div className="service-card-icon">{s.icon}</div>
              <div className="service-card-name">{s.name}</div>
              <div className="service-card-desc">{s.desc}</div>
              <div className="service-card-footer">
                <div className="service-price">₹{s.price} <span>onwards</span></div>
                <button className="btn-book" onClick={() => openService(s)}>Book Now</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button className="btn-outline" onClick={() => setPage("services")}>View All 11 Services →</button>
        </div>
      </section>

      <div className="divider" />

      {/* Testimonials */}
      <section className="section">
        <div className="center">
          <p className="section-label">Customer Reviews</p>
          <h2 className="section-title">Trusted by thousands</h2>
        </div>
        <div className="testimonials-grid">
          {[
            { text: "Got my PAN card corrections done without stepping out of my house. Paid online, uploaded my docs, and received the acknowledgment PDF on WhatsApp. Excellent service!", name: "Rajesh Kumar", role: "Small Business Owner" },
            { text: "Filed my ITR in 20 minutes. The team responded on WhatsApp and guided me through the documents. Very professional and affordable.", name: "Priya Sharma", role: "Salaried Professional" },
            { text: "Needed a rent agreement urgently. Universal Technologies had it ready and notarized within the same day. Highly recommended!", name: "Mohammed Irshaad", role: "Tenant, Hyderabad" },
          ].map(t => (
            <div className="testi-card" key={t.name}>
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">"{t.text}"</p>
              <div className="testi-name">{t.name}</div>
              <div className="testi-role">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "0 5vw 88px" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(30,111,255,0.15), rgba(0,212,255,0.08))",
          border: "1px solid rgba(30,111,255,0.25)",
          borderRadius: 20,
          padding: "52px 40px",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, marginBottom: 14 }}>
            Ready to get started?
          </h2>
          <p style={{ color: "#8B95B0", fontSize: 15, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
            Select a service, upload your documents, and pay online in under 3 minutes. We handle the rest.
          </p>
          <button className="btn-primary" onClick={() => setPage("services")}>Start Your Application →</button>
        </div>
      </section>
    </>
  );
}

function ServicesPage({ openService }) {
  const [activeTab, setActiveTab] = useState("all");
  const filtered = activeTab === "all" ? SERVICES : SERVICES.filter(s => s.cat === activeTab);

  return (
    <section className="section" style={{ paddingTop: 108 }}>
      <p className="section-label">All Services</p>
      <h2 className="section-title">Government &amp; Digital Services</h2>
      <p className="section-sub">Apply online from anywhere. Upload documents, pay securely, and receive completed work via WhatsApp or email.</p>

      <div className="services-tabs">
        {[
          { id: "all", label: "All Services" },
          { id: "govt", label: "🏛️ Government & Tax" },
          { id: "edu", label: "📋 Documentation & Other" },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div className="services-grid">
        {filtered.map(s => (
          <div className="service-card" key={s.id}>
            <div className="service-card-icon">{s.icon}</div>
            <div className="service-card-name">{s.name}</div>
            <div className="service-card-desc">{s.desc}</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#4A5470", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 }}>Documents Required:</div>
              {s.docs.map(d => <div key={d} style={{ fontSize: 12, color: "#8B95B0", paddingLeft: 10, borderLeft: "2px solid rgba(30,111,255,0.3)", marginBottom: 3, lineHeight: 1.5 }}>{d}</div>)}
            </div>
            <div className="service-card-footer">
              <div className="service-price">₹{s.price} <span>onwards</span></div>
              <button className="btn-book" onClick={() => openService(s)}>Apply Now</button>
            </div>
          </div>
        ))}
      </div>

      {/* Connect Online Banner */}
      <div style={{
        marginTop: 56,
        background: "rgba(37,211,102,0.06)",
        border: "1px solid rgba(37,211,102,0.2)",
        borderRadius: 16,
        padding: "28px 32px",
        display: "flex",
        gap: 20,
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        <div style={{ fontSize: 32 }}>💬</div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Not sure which service you need?</div>
          <div style={{ fontSize: 13, color: "#8B95B0" }}>Chat with us on WhatsApp and we'll guide you to the right service.</div>
        </div>
        <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
          style={{ background: "#25D366", color: "#fff", padding: "12px 24px", borderRadius: 9, fontWeight: 700, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}>
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}

function DashboardPage() {
  const [tab, setTab] = useState("orders");
  return (
    <div className="dashboard" style={{ paddingTop: 108 }}>
      <div className="dash-header">
        <h1 className="dash-title">My Dashboard</h1>
        <p className="dash-sub">Track orders, view payments, and download completed documents.</p>
      </div>
      <div className="dash-cards">
        <div className="dash-card">
          <div className="dash-card-label">Total Orders</div>
          <div className="dash-card-val">3</div>
          <div className="dash-card-sub">All time</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Completed</div>
          <div className="dash-card-val">1</div>
          <div className="dash-card-sub" style={{ color: "#00C97A" }}>Ready to download</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">In Progress</div>
          <div className="dash-card-val">1</div>
          <div className="dash-card-sub" style={{ color: "#1E6FFF" }}>Being processed</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Total Paid</div>
          <div className="dash-card-val">₹897</div>
          <div className="dash-card-sub">Across all orders</div>
        </div>
      </div>

      <div className="dash-tabs">
        {["orders", "payments", "documents"].map(t => (
          <button key={t} className={`dash-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}>
            {t === "orders" ? "📋 My Orders" : t === "payments" ? "💳 Payments" : "📁 Documents"}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div style={{ overflowX: "auto" }}>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Service</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td style={{ color: "#F0F4FF" }}>{o.service}</td>
                  <td>{o.date}</td>
                  <td>₹{o.amount}</td>
                  <td>
                    <span className="status-badge" style={{
                      background: `${statusColor(o.status)}18`,
                      color: statusColor(o.status),
                      border: `1px solid ${statusColor(o.status)}30`
                    }}>
                      ● {o.status}
                    </span>
                  </td>
                  <td>
                    {o.status === "Completed"
                      ? <button className="btn-sm btn-green">⬇ Download</button>
                      : <button className="btn-sm btn-blue">View Details</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "payments" && (
        <div style={{ overflowX: "auto" }}>
          <table className="orders-table">
            <thead>
              <tr><th>Order ID</th><th>Service</th><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td style={{ color: "#F0F4FF" }}>{o.service}</td>
                  <td>{o.date}</td>
                  <td>₹{o.amount}</td>
                  <td>UPI</td>
                  <td><span className="status-badge" style={{ background: "#00C97A18", color: "#00C97A", border: "1px solid #00C97A30" }}>● Paid</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "documents" && (
        <div className="services-grid">
          {[
            { name: "PAN Card Acknowledgment", order: "UT2024001", ready: true },
            { name: "Rent Agreement Draft", order: "UT2024003", ready: false },
          ].map(d => (
            <div className="service-card" key={d.name}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>📄</div>
              <div className="service-card-name">{d.name}</div>
              <div className="service-card-desc">Order: {d.order}</div>
              {d.ready
                ? <button className="btn-primary" style={{ width: "100%", marginTop: 8 }}>⬇ Download Document</button>
                : <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#F59E0B", marginTop: 8, textAlign: "center" }}>⏳ Processing — will be ready soon</div>
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <section className="section" style={{ paddingTop: 108 }}>
      <p className="section-label">Get In Touch</p>
      <h2 className="section-title">Visit Us or Connect Online</h2>
      <p className="section-sub">We're available in-store and online. Most queries answered within the hour.</p>

      <div className="contact-grid">
        <div className="contact-info">
          {[
            { icon: "📍", label: "Address", val: "Universal Technologies, Shop No. 12, Main Market, Your City — 500001" },
            { icon: "📞", label: "Phone / WhatsApp", val: "+91 98765 43210" },
            { icon: "✉️", label: "Email", val: "info@universaltechnologies.in" },
            { icon: "🕐", label: "Working Hours", val: "Mon–Sat: 9:00 AM – 8:00 PM · Sunday: 10:00 AM – 4:00 PM" },
          ].map(c => (
            <div className="contact-item" key={c.label}>
              <div className="contact-item-icon">{c.icon}</div>
              <div>
                <div className="contact-item-label">{c.label}</div>
                <div className="contact-item-val">{c.val}</div>
              </div>
            </div>
          ))}

          {/* Social */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#8B95B0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Follow Us</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: "WhatsApp", icon: "💬", color: "#25D366", href: "https://wa.me/919876543210" },
                { label: "Facebook", icon: "📘", color: "#1877F2", href: "#" },
                { label: "Instagram", icon: "📸", color: "#E4405F", href: "#" },
                { label: "YouTube", icon: "▶️", color: "#FF0000", href: "#" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 9, padding: "9px 14px", textDecoration: "none", color: "#F0F4FF",
                    fontSize: 13, fontWeight: 600
                  }}>
                  {s.icon} {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="map-placeholder" style={{ marginTop: 28 }}>
            <div style={{ fontSize: 36 }}>🗺️</div>
            <div style={{ fontWeight: 600, color: "#8B95B0" }}>Google Maps</div>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer"
              style={{ color: "#1E6FFF", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
              Open in Maps →
            </a>
          </div>
        </div>

        <div className="inquiry-form">
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Send us a message</h3>
          {sent ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Message Received!</div>
              <div style={{ fontSize: 13, color: "#8B95B0" }}>We'll get back to you within 1 hour on WhatsApp or email.</div>
            </div>
          ) : (
            <>
              {["Full Name", "Mobile Number", "Email", "Service Interested In"].map(f => (
                <div className="form-group" key={f}>
                  <label className="form-label">{f}</label>
                  <input className="form-input" placeholder={`Enter ${f.toLowerCase()}`} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea className="form-input" rows={4} placeholder="Tell us how we can help..." style={{ resize: "vertical" }} />
              </div>
              <button className="btn-primary" style={{ width: "100%" }} onClick={() => setSent(true)}>
                Send Message →
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function AdminPanel() {
  const [orders, setOrders] = useState(MOCK_ORDERS.map(o => ({ ...o })));
  const updateStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  return (
    <div className="admin-panel" style={{ paddingTop: 108 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Admin Panel</h1>
          <span style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>ADMIN ACCESS</span>
        </div>
        <p style={{ fontSize: 14, color: "#8B95B0" }}>Manage orders, update statuses, and download customer documents.</p>
      </div>

      <div className="admin-grid">
        {[
          { icon: "📋", val: "3", label: "Total Orders" },
          { icon: "⏳", val: "1", label: "Pending" },
          { icon: "⚙️", val: "1", label: "In Progress" },
          { icon: "✅", val: "1", label: "Completed" },
          { icon: "💰", val: "₹897", label: "Total Revenue" },
          { icon: "📄", val: "5", label: "Docs Received" },
        ].map(s => (
          <div className="admin-stat" key={s.label}>
            <div className="admin-stat-icon">{s.icon}</div>
            <div className="admin-stat-val">{s.val}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Manage Orders</h3>
      <div style={{ overflowX: "auto" }}>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Docs</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td style={{ color: "#F0F4FF" }}>Customer</td>
                <td>{o.service}</td>
                <td>{o.date}</td>
                <td>₹{o.amount}</td>
                <td><button className="btn-sm btn-blue">⬇ Download</button></td>
                <td>
                  <select className="select-input" value={o.status}
                    onChange={e => updateStatus(o.id, e.target.value)}>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </td>
                <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button className="btn-sm btn-blue">📤 Notify</button>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
                    style={{ background: "rgba(37,211,102,0.15)", color: "#25D366", border: "1px solid rgba(37,211,102,0.3)", borderRadius: 7, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>
                    💬 WA
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div className="nav-logo-icon">UT</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Universal Technologies</div>
              <div style={{ fontSize: 10, color: "#00D4FF", letterSpacing: 1.5, textTransform: "uppercase" }}>Digital Service Portal</div>
            </div>
          </div>
          <p>Your trusted partner for government and digital documentation services. Apply online, pay securely, and receive completed work on WhatsApp.</p>
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            {["WhatsApp", "Facebook", "Instagram", "YouTube"].map(s => (
              <a key={s} href="#" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 12px", fontSize: 11, color: "#8B95B0", textDecoration: "none", fontWeight: 600 }}>{s}</a>
            ))}
          </div>
        </div>
        <div>
          <div className="footer-col-title">Services</div>
          <ul className="footer-links">
            {["PAN Card", "Aadhaar Update", "Voter ID", "Passport", "ITR Filing", "GST Registration"].map(s => (
              <li key={s}><a href="#">{s}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Quick Links</div>
          <ul className="footer-links">
            <li><a onClick={() => setPage("home")} style={{ cursor: "pointer" }}>Home</a></li>
            <li><a onClick={() => setPage("services")} style={{ cursor: "pointer" }}>All Services</a></li>
            <li><a onClick={() => setPage("dashboard")} style={{ cursor: "pointer" }}>My Orders</a></li>
            <li><a onClick={() => setPage("contact")} style={{ cursor: "pointer" }}>Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Refund Policy</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Contact</div>
          <ul className="footer-links">
            <li><a href="tel:+919876543210">📞 +91 98765 43210</a></li>
            <li><a href="https://wa.me/919876543210">💬 WhatsApp Us</a></li>
            <li><a href="mailto:info@universaltechnologies.in">✉️ Email Us</a></li>
            <li><a href="#">📍 Find on Maps</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 Universal Technologies. All rights reserved.</p>
        <div className="footer-pay-icons">
          {["UPI", "Visa", "Mastercard", "Razorpay"].map(p => (
            <span key={p} className="pay-icon-badge">{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── App Root ────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedService, setSelectedService] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const openService = (s) => { setSelectedService(s); setMobileOpen(false); };
  const closeModal = () => setSelectedService(null);

  const handleSuccess = (orderId) => {
    setTimeout(() => {
      setToast(`✅ Order ${orderId} confirmed! Check My Orders to track.`);
      setTimeout(() => setToast(null), 4000);
    }, 3200);
  };

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  return (
    <>
      <style>{G}</style>
      <Navbar page={page} setPage={(p) => { setPage(p); setMobileOpen(false); }} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main style={{ paddingTop: 0 }}>
        {page === "home" && <HomePage setPage={setPage} openService={openService} />}
        {page === "services" && <ServicesPage openService={openService} />}
        {page === "dashboard" && <DashboardPage />}
        {page === "contact" && <ContactPage />}
        {page === "admin" && <AdminPanel />}
      </main>

      {page !== "admin" && <Footer setPage={setPage} />}

      {selectedService && (
        <OrderModal service={selectedService} onClose={closeModal} onSuccess={handleSuccess} />
      )}

      <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="wa-fab" title="Chat on WhatsApp">
        💬
      </a>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
