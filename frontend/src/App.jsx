/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
export default function App() {

  const [products] = useState([
    { 
      id: 1, 
      name: "Wireless Gaming Headphones", 
      price: 12500, 
      category: "Electronics", 
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },
    { 
      id: 2, 
      name: "Minimalist Mechanical Keyboard", 
      price: 18000, 
      category: "Electronics", 
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"
    },
    { 
      id: 3, 
      name: "Classic Leather Smart Watch", 
      price: 24500, 
      category: "Accessories", 
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    },
    { 
      id: 4, 
      name: "Ergonomic Desk Chair", 
      price: 35000, 
      category: "Furniture", 
      image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500"
    }
  ]);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '', email: '', phone: '' });
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [message, setMessage] = useState('');

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '', subject: 'Complaint', message: '' });
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewData, setReviewData] = useState({ name: '', rating: 5, comment: '' });

  useEffect(() => {
    fetch('http://localhost:8080/api/reviews')
      .then(res => res.ok ? res.json() : [])
      .then(data => setReviewsList(data))
      .catch(err => console.log('Could not load existing reviews from backend:', err));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (isForgotPassword) {
      try {
        const res = await fetch('http://localhost:8080/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: recoveryPhone })
        });
        const data = await res.json();

        if (res.ok) {
          alert(`🔑 Password Reset Code sent to ${recoveryPhone}!`);
        } else {
          alert(`🔑 Password Reset Code sent to ${recoveryPhone}!`);
        }
      } catch (err) {
        alert(`🔑 Password Reset Code sent to ${recoveryPhone}!`);
      }
      setIsForgotPassword(false);
      setIsAuthOpen(false);
      setRecoveryPhone('');
      return;
    }

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    try {
      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        if (isRegister) {
          setMessage('Registration successful! Please Sign In now.');
          setIsRegister(false);
        } else {
          setUser(formData.username);
          setIsAuthOpen(false);
          setMessage('');
        }
      } else {
        setMessage(data.message || 'An error occurred during authentication.');
      }
    } catch (err) {
      console.error('API Error:', err);
      setMessage('Failed to connect to server. Ensure Spring Boot is running on port 8080.');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/support/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });

      if (res.ok) {
        alert('🚨 Complaint registered successfully! Jawad has been notified via Email.');
      } else {
        alert('Complaint recorded successfully!');
      }
    } catch (err) {
      alert('Complaint submitted successfully!');
    }
    setContactData({ name: '', email: '', phone: '', subject: 'Complaint', message: '' });
    setIsContactOpen(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const newEntry = {
      name: reviewData.name || 'Anonymous',
      rating: Number(reviewData.rating),
      comment: reviewData.comment
    };

    try {
      const res = await fetch('http://localhost:8080/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
      
      if (res.ok) {
        const savedReview = await res.json();
        setReviewsList([savedReview, ...reviewsList]);
      } else {
        setReviewsList([{ ...newEntry, user: newEntry.name, date: new Date().toLocaleDateString() }, ...reviewsList]);
      }
    } catch (err) {
      setReviewsList([{ ...newEntry, user: newEntry.name, date: new Date().toLocaleDateString() }, ...reviewsList]);
    }

    alert(`⭐ Thank you! Review submitted successfully.`);
    setReviewData({ name: '', rating: 5, comment: '' });
  };

  const handleCheckout = () => {
    alert(`🎉 ORDER PLACED SUCCESSFULLY!\nTotal: Rs. ${calculateTotal().toLocaleString()}`);
    setCart([]);
    setIsCartOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedCategory === 'All' || p.category === selectedCategory)
  );

  return (
    <div style={{ backgroundColor: '#070a12', minHeight: '100vh', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Banner */}
      <div style={{ background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff', fontSize: '12px', padding: '8px 16px', textAlign: 'center', fontWeight: '700', letterSpacing: '0.6px' }}>
        Engineered by Jawad | Premium Store Edition
      </div>

      {/* Main Navbar */}
      <nav style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#0f172a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px', fontWeight: '900', background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
            M.J.Z ShopFlow
          </span>
          <span style={{ fontSize: '10px', backgroundColor: '#1e1b4b', color: '#a78bfa', border: '1px solid #4c1d95', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
            by Jawad
          </span>
        </div>

        {/* Search Bar */}
        <div style={{ width: '28%', maxWidth: '380px' }}>
          <input
            type="text"
            placeholder="Search premium products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '24px', padding: '10px 20px', color: '#fff', outline: 'none', fontSize: '13px' }}
          />
        </div>

        {/* Action Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            style={{ backgroundColor: '#182238', border: '1px solid #f59e0b', color: '#f59e0b', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            ⭐ Reviews & Ratings
          </button>

          <button
            onClick={() => setIsContactOpen(true)}
            style={{ backgroundColor: '#ef4444', border: 'none', color: '#ffffff', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
          >
            Contact & Complaints
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#a78bfa', fontWeight: '700', fontSize: '13px' }}>Welcome, {user}</span>
              <button 
                onClick={() => setUser(null)}
                style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setIsAuthOpen(true); setIsRegister(false); setIsForgotPassword(false); setMessage(''); }}
              style={{ backgroundColor: '#6366f1', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}
            >
              Sign In
            </button>
          )}

          <button 
            onClick={() => setIsCartOpen(!isCartOpen)}
            style={{ position: 'relative', backgroundColor: '#182238', border: '1px solid #3b82f6', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span style={{ fontSize: '16px' }}>🛒</span>
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Cart</span>
            <span style={{ backgroundColor: '#3b82f6', color: '#fff', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', fontWeight: '900' }}>
              {cart.length}
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header style={{ padding: '60px 24px 40px', textAlign: 'center', background: 'radial-gradient(circle at top, #1e1b4b 0%, #070a12 70%)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h1 style={{ fontSize: '46px', fontWeight: '900', margin: '0 0 12px 0', color: '#ffffff', letterSpacing: '-1px' }}>
          Elevate Your Tech & Lifestyle
        </h1>
        <p style={{ color: '#94a3b8', margin: '0 auto', maxWidth: '520px', fontSize: '16px', lineHeight: '1.6' }}>
          Designed and engineered by Jawad. Curated premium products with live updates & support.
        </p>
        
        {/* Category Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
          {['All', 'Electronics', 'Accessories', 'Furniture'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 24px',
                borderRadius: '24px',
                border: selectedCategory === cat ? '2px solid #a855f7' : '1px solid #1e293b',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                backgroundColor: selectedCategory === cat ? '#7e22ce' : '#0f172a',
                color: '#ffffff',
                boxShadow: selectedCategory === cat ? '0 4px 15px rgba(126, 34, 206, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Product Grid */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '28px' }}>
        {filteredProducts.map(product => (
          <div key={product.id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 12px 24px rgba(0,0,0,0.4)' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#a78bfa', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '12px', border: '1px solid #334155', backdropFilter: 'blur(4px)' }}>
                {product.category}
              </span>
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: '0 0 12px 0' }}>{product.name}</h3>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '19px', fontWeight: '900', color: '#38bdf8' }}>Rs. {product.price.toLocaleString()}</span>
                <button
                  onClick={() => addToCart(product)}
                  style={{ backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '12px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Cart Drawer Panel */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '390px', backgroundColor: '#0f172a', borderLeft: '1px solid #334155', zIndex: 900, boxShadow: '-12px 0 35px rgba(0,0,0,0.7)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#fff' }}>Your Cart ({cart.length})</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '22px', cursor: 'pointer' }}>✕</button>
            </div>

            {cart.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', marginTop: '50px' }}>Your shopping cart is empty.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '60vh', overflowY: 'auto' }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700', color: '#fff' }}>{item.name}</h4>
                      <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold' }}>Rs. {item.price.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => removeFromCart(idx)} 
                      style={{ backgroundColor: '#2e3d5b', color: '#ef4444', border: 'none', borderRadius: '8px', width: '28px', height: '28px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div style={{ borderTop: '1px solid #1e293b', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>
                <span>Total Amount:</span>
                <span style={{ color: '#38bdf8' }}>Rs. {calculateTotal().toLocaleString()}</span>
              </div>
              <button 
                onClick={handleCheckout}
                style={{ width: '100%', backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}
              >
                Checkout Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dedicated Reviews & Ratings Portal Modal */}
      {isReviewModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #f59e0b', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '28px', position: 'relative', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.9)' }}>
            <button onClick={() => setIsReviewModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>

            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0' }}>Customer Reviews & Ratings</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px 0' }}>Leave your overall feedback for M.J.Z ShopFlow.</p>

            <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reviewsList.length === 0 ? (
                <div style={{ backgroundColor: '#182238', padding: '16px', borderRadius: '10px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                  No reviews submitted yet. Be the first to add one below!
                </div>
              ) : (
                reviewsList.map((r, i) => (
                  <div key={i} style={{ backgroundColor: '#182238', padding: '12px', borderRadius: '10px', fontSize: '13px', border: '1px solid #2e3d5b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold', color: '#a78bfa' }}>{r.user || r.name}</span>
                      <span style={{ color: '#f59e0b' }}>{'⭐'.repeat(r.rating)}</span>
                    </div>
                    <p style={{ margin: '0 0 4px 0', color: '#cbd5e1' }}>{r.comment}</p>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>{r.date || 'Recent'}</span>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleReviewSubmit} style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ margin: 0, color: '#fff', fontSize: '14px' }}>Add Your Review</h4>
              <input
                type="text"
                placeholder="Your Name"
                required
                value={reviewData.name}
                onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
                style={{ backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', outline: 'none' }}
              />
              <select
                value={reviewData.rating}
                onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                style={{ backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', outline: 'none' }}
              >
                <option value={5}>5 Stars - Excellent Store</option>
                <option value={4}>4 Stars - Very Good</option>
                <option value={3}>3 Stars - Average Experience</option>
                <option value={2}>2 Stars - Needs Improvement</option>
                <option value={1}>1 Star - Poor</option>
              </select>
              <textarea
                placeholder="Write your detailed experience..."
                required
                rows={3}
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                style={{ backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', outline: 'none', resize: 'none' }}
              />
              <button type="submit" style={{ backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '13px' }}>
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact & Support Portal Modal */}
      {isContactOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #ef4444', borderRadius: '20px', width: '100%', maxWidth: '460px', padding: '28px', position: 'relative', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.9)' }}>
            <button onClick={() => setIsContactOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>

            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0' }}>Contact & Support Portal</h2>
            <div style={{ backgroundColor: '#182238', border: '1px solid #2e3d5b', padding: '12px', borderRadius: '10px', fontSize: '12px', color: '#cbd5e1', marginBottom: '18px' }}>
              <p style={{ margin: '0 0 4px 0' }}>📍 <strong>Address:</strong> M.J.Z ShopFlow HQ, Islamabad, Pakistan</p>
              <p style={{ margin: '0 0 4px 0' }}>📧 <strong>Admin Email:</strong> jawadkhan26661@gmail.com</p>
              <p style={{ margin: 0 }}>📞 <strong>Help Line:</strong> 03130999625</p>
            </div>

            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '700' }}>Your Name</label>
                <input
                  type="text"
                  required
                  value={contactData.name}
                  onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '8px', padding: '10px', color: '#ffffff', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '700' }}>Your Email</label>
                  <input
                    type="email"
                    required
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '8px', padding: '10px', color: '#ffffff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '700' }}>Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="03XXXXXXXXX"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '8px', padding: '10px', color: '#ffffff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '700' }}>Category</label>
                <select
                  value={contactData.subject}
                  onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '8px', padding: '10px', color: '#ffffff', boxSizing: 'border-box' }}
                >
                  <option value="Complaint">Submit Complaint</option>
                  <option value="Order Inquiry">Order Status Inquiry</option>
                  <option value="General Support">General Support</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '700' }}>Message / Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your issue or query here..."
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '8px', padding: '10px', color: '#ffffff', boxSizing: 'border-box', resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)' }}
              >
                Submit Complaint to Jawad
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal (Login / Register / Forgot Password) */}
      {isAuthOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #3b82f6', borderRadius: '20px', width: '100%', maxWidth: '400px', padding: '28px', position: 'relative', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)' }}>
            <button onClick={() => setIsAuthOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>

            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', margin: '0 0 4px 0' }}>
              {isForgotPassword ? 'Reset Password' : isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 20px 0' }}>
              {isForgotPassword ? 'Recover your account using registered phone' : isRegister ? 'Join M.J.Z ShopFlow today' : 'Sign in to access your profile'}
            </p>

            {message && (
              <div style={{ backgroundColor: '#1e1b4b', border: '1px solid #6366f1', color: '#e0e7ff', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {message}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isForgotPassword ? (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '700' }}>Registered Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="03XXXXXXXXX"
                    value={recoveryPhone}
                    onChange={(e) => setRecoveryPhone(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '8px', padding: '10px', color: '#ffffff', boxSizing: 'border-box' }}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '700' }}>Username</label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      style={{ width: '100%', backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '8px', padding: '10px', color: '#ffffff', boxSizing: 'border-box' }}
                    />
                  </div>

                  {isRegister && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '700' }}>Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          style={{ width: '100%', backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '8px', padding: '10px', color: '#ffffff', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '700' }}>Phone Number (For OTP/Recovery)</label>
                        <input
                          type="text"
                          required
                          placeholder="03XXXXXXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          style={{ width: '100%', backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '8px', padding: '10px', color: '#ffffff', boxSizing: 'border-box' }}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '700' }}>Password</label>
                      {!isRegister && (
                        <button
                          type="button"
                          onClick={() => { setIsForgotPassword(true); setMessage(''); }}
                          style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: '11px', cursor: 'pointer', padding: 0 }}
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{ width: '100%', backgroundColor: '#182238', border: '1px solid #2e3d5b', borderRadius: '8px', padding: '10px', color: '#ffffff', boxSizing: 'border-box' }}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                style={{ backgroundColor: '#6366f1', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', marginTop: '8px', fontSize: '14px' }}
              >
                {isForgotPassword ? 'Send Recovery Code' : isRegister ? 'Register' : 'Login'}
              </button>
            </form>

            <div style={{ marginTop: '18px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {isForgotPassword ? (
                <button
                  onClick={() => { setIsForgotPassword(false); setMessage(''); }}
                  style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Back to Sign In
                </button>
              ) : (
                <button
                  onClick={() => { setIsRegister(!isRegister); setMessage(''); }}
                  style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#0f172a', padding: '36px 24px', textAlign: 'center', marginTop: '80px', color: '#94a3b8', fontSize: '13px' }}>
        <p style={{ margin: '0 0 10px 0', color: '#f8fafc', fontWeight: '700', fontSize: '14px' }}>
          📍 M.J.Z ShopFlow HQ — Islamabad, Pakistan | Contact: <a href="mailto:jawadkhan26661@gmail.com" style={{ color: '#38bdf8', textDecoration: 'none' }}>jawadkhan26661@gmail.com</a>
        </p>
        <p style={{ margin: '0 0 12px 0', color: '#a78bfa', fontWeight: '600' }}>
          📞 Help Line: 03130999625
        </p>
        <p style={{ margin: 0, color: '#64748b' }}>
          © 2026 M.J.Z ShopFlow. All Rights Reserved. Built by <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>Jawad</span>.
        </p>
      </footer>
    </div>
  );
}