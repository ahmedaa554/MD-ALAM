import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Printer, 
  MapPin, 
  Clock, 
  Menu, 
  X, 
  ShoppingBag, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Upload, 
  CreditCard, 
  MessageSquare,
  Sparkles,
  Zap,
  Truck
} from 'lucide-react';
import { Product, CartItem, PrintConfig, DeliveryMethod, OrderDetails } from './types';
import { getPrintAdvice } from './services/gemini';

// --- DATA CONSTANTS ---
const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Luxury Business Cards',
    description: 'Thick, premium texture cards that make a lasting impression.',
    image: 'https://picsum.photos/400/300?random=1',
    basePrice: 50,
    category: 'Business'
  },
  {
    id: 'p2',
    name: 'Marketing Flyers',
    description: 'Glossy or matte vibrant flyers for events and promotions.',
    image: 'https://picsum.photos/400/300?random=2',
    basePrice: 150,
    category: 'Marketing'
  },
  {
    id: 'p3',
    name: 'Roll-up Banners',
    description: 'Durable, portable stands perfect for exhibitions and retail.',
    image: 'https://picsum.photos/400/300?random=3',
    basePrice: 200,
    category: 'Large Format'
  },
  {
    id: 'p4',
    name: 'Corporate Booklets',
    description: 'Professional saddle-stitched or perfect bound booklets.',
    image: 'https://picsum.photos/400/300?random=4',
    basePrice: 300,
    category: 'Business'
  },
];

// --- COMPONENTS ---

// 1. Navigation
const Navbar = ({ cartCount }: { cartCount: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-900 p-2 rounded-lg text-white">
              <Printer size={24} />
            </div>
            <div>
              <span className="text-xl font-bold text-primary-900 block leading-none">ABU DHABI</span>
              <span className="text-sm font-medium text-accent-purple block leading-none">PRINT PRO</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-medium hover:text-accent-purple transition-colors ${location.pathname === '/' ? 'text-accent-purple' : 'text-gray-600'}`}>Home</Link>
            <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-accent-purple transition-colors">Products</Link>
            <a href="#services" className="text-sm font-medium text-gray-600 hover:text-accent-purple transition-colors">Services</a>
            <a href="#locations" className="text-sm font-medium text-gray-600 hover:text-accent-purple transition-colors">Locations</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/checkout" className="relative p-2 text-gray-600 hover:text-accent-purple transition-colors">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent-purple rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="md:hidden p-2 text-gray-600" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/products" className="hidden md:block bg-primary-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-800 transition-all shadow-lg hover:shadow-primary-900/30">
              Start Printing
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent-purple hover:bg-gray-50" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent-purple hover:bg-gray-50" onClick={() => setIsOpen(false)}>Products</Link>
            <Link to="/checkout" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent-purple hover:bg-gray-50" onClick={() => setIsOpen(false)}>Cart</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

// 2. AI Assistant
const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Hello! Need help choosing the right paper or finish? Ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const reply = await getPrintAdvice(userMsg);
    
    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-200 mb-4 overflow-hidden flex flex-col h-[500px] animate-fade-in-up">
          <div className="bg-primary-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <Sparkles size={18} className="text-accent-gold" />
              <span className="font-semibold">Print Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary-900 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
               <div className="flex justify-start">
               <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-accent-purple outline-none"
              placeholder="Ask about paper types..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-accent-purple text-white p-2 rounded-full hover:bg-purple-800 transition-colors disabled:opacity-50"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-900 hover:bg-primary-800 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center group"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:animate-pulse" />}
      </button>
    </div>
  );
};

// 3. Home Page
const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-purple/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Open 24/7 in Abu Dhabi</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Same-Day Printing. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-gold">
                Fast. Reliable.
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-lg">
              Enterprise-grade offset & digital printing. From business cards to large banners, get it printed and delivered today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="bg-accent-purple text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/50 text-center">
                Start Printing
              </Link>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all text-center">
                Calculate Price
              </button>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400 pt-4">
              <div className="flex items-center"><CheckCircle size={16} className="mr-2 text-accent-cyan" /> 30+ Years Experience</div>
              <div className="flex items-center"><CheckCircle size={16} className="mr-2 text-accent-cyan" /> 10+ Branches</div>
            </div>
          </div>
          
          <div className="md:w-1/2 mt-12 md:mt-0 relative">
            {/* Abstract mockups */}
            <div className="relative z-10 grid grid-cols-2 gap-4 transform rotate-[-5deg]">
              <img src="https://picsum.photos/300/400?random=10" alt="Print Mockup 1" className="rounded-2xl shadow-2xl border-4 border-white/10" />
              <img src="https://picsum.photos/300/400?random=11" alt="Print Mockup 2" className="rounded-2xl shadow-2xl border-4 border-white/10 mt-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-900">Why Choose Print Pro?</h2>
            <p className="mt-4 text-gray-600">The preferred printing partner for Abu Dhabi's top enterprises.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-accent-purple mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Same-day turnaround for most standard orders placed before 2 PM.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-accent-purple mb-6">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">State-of-the-art Heidelberg offset machines and digital HP Indigo presses.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-accent-purple mb-6">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free Delivery</h3>
              <p className="text-gray-600">Free delivery across Abu Dhabi for all orders above AED 200.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-white" id="products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary-900">Popular Categories</h2>
              <p className="mt-2 text-gray-600">Everything you need to market your business.</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center text-accent-purple font-semibold hover:text-purple-800">
              View All <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => (
              <Link to={`/products/${product.id}`} key={product.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
                  <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/0 transition-colors z-10"></div>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-accent-purple transition-colors">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                <div className="mt-2 text-sm font-semibold text-gray-900">From AED {product.basePrice}</div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/products" className="inline-flex items-center text-accent-purple font-semibold">
               View All <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Locations / Map Placeholder */}
      <section className="py-20 bg-gray-900 text-white" id="locations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Visit Our Branches</h2>
              <p className="text-gray-400 mb-8">We have 12 convenient locations across Abu Dhabi, ensuring you're never far from premium printing services.</p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="text-accent-cyan mt-1 mr-4" />
                  <div>
                    <h4 className="font-bold">Main Headquarters - Al Reem Island</h4>
                    <p className="text-sm text-gray-400">Addax Tower, Lobby Level</p>
                    <p className="text-sm text-accent-gold mt-1">Open 24/7</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="text-accent-cyan mt-1 mr-4" />
                  <div>
                    <h4 className="font-bold">Downtown Branch - Hamdan Street</h4>
                    <p className="text-sm text-gray-400">Emerald Building, Shop 4</p>
                    <p className="text-sm text-gray-400 mt-1">8:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-80 bg-gray-800 rounded-2xl overflow-hidden relative">
               {/* Static Map Image */}
               <img src="https://picsum.photos/800/600?grayscale" alt="Map" className="w-full h-full object-cover opacity-60" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center">
                   <MapPin size={20} className="mr-2 text-accent-purple" /> Find Nearest Branch
                 </button>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// 4. Product Config Page
const ProductPage = ({ addToCart }: { addToCart: (item: CartItem) => void }) => {
  const { id } = React.useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  
  const [config, setConfig] = useState<PrintConfig>({
    paperType: 'Standard Matte',
    size: 'Standard (9x5cm)',
    quantity: 100,
    finish: 'None'
  });
  
  const [price, setPrice] = useState(product.basePrice);
  const [file, setFile] = useState<File | null>(null);

  // Simple price calculation logic
  useEffect(() => {
    let multiplier = 1;
    if (config.paperType.includes('Premium')) multiplier += 0.5;
    if (config.finish !== 'None') multiplier += 0.3;
    if (config.quantity > 100) multiplier += (config.quantity / 100) * 0.5;
    
    setPrice(Math.round(product.basePrice * multiplier));
  }, [config, product]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: Date.now().toString(),
      product,
      config,
      totalPrice: price,
      uploadedFile: file
    });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Preview & Visuals */}
            <div className="bg-gray-100 p-8 lg:p-12 flex flex-col justify-between relative">
              <Link to="/products" className="absolute top-6 left-6 text-gray-500 hover:text-gray-900 flex items-center text-sm font-medium">
                <ArrowRight className="transform rotate-180 mr-1" size={16} /> Back
              </Link>
              
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-[4/3] bg-white rounded-xl shadow-2xl p-4 transform rotate-1 transition-transform hover:rotate-0 duration-500">
                  {file ? (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-center p-4">
                      <div>
                        <p className="font-bold text-gray-900 mb-2">File Uploaded</p>
                        <p className="text-sm break-all">{file.name}</p>
                      </div>
                    </div>
                  ) : (
                     <img src={product.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  )}
                  {/* Overlay Labels */}
                   <div className="absolute top-4 right-4 bg-accent-gold text-white text-xs font-bold px-2 py-1 rounded shadow">
                     {config.quantity} PCS
                   </div>
                   <div className="absolute bottom-4 left-4 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded shadow">
                     {config.size}
                   </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Live Specs</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                   <div className="flex justify-between border-b border-gray-300 pb-1">
                     <span>Paper</span> <span className="font-medium text-gray-900">{config.paperType}</span>
                   </div>
                   <div className="flex justify-between border-b border-gray-300 pb-1">
                     <span>Finish</span> <span className="font-medium text-gray-900">{config.finish}</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Right: Configuration */}
            <div className="p-8 lg:p-12">
              <h1 className="text-3xl font-extrabold text-primary-900 mb-2">{product.name}</h1>
              <p className="text-gray-500 mb-8">{product.description}</p>

              <div className="space-y-6">
                
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-accent-purple transition-colors bg-gray-50 group text-center cursor-pointer relative">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept=".pdf,.ai,.psd,.jpg,.png" />
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-accent-purple mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Drag & Drop your design</p>
                    <p className="text-xs text-gray-500 mt-1">Support PDF, AI, PSD (Max 50MB)</p>
                  </div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paper Type</label>
                    <select 
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent-purple focus:border-transparent outline-none"
                      value={config.paperType}
                      onChange={(e) => setConfig({...config, paperType: e.target.value})}
                    >
                      <option>Standard Matte</option>
                      <option>Premium Glossy</option>
                      <option>Recycled Kraft</option>
                      <option>Textured Linen</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <select 
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent-purple focus:border-transparent outline-none"
                      value={config.size}
                      onChange={(e) => setConfig({...config, size: e.target.value})}
                    >
                      <option>Standard (9x5cm)</option>
                      <option>Square (6x6cm)</option>
                      <option>Slim (8x4cm)</option>
                    </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                     <div className="flex items-center space-x-2">
                       {[100, 250, 500, 1000].map(q => (
                         <button 
                           key={q}
                           onClick={() => setConfig({...config, quantity: q})}
                           className={`flex-1 py-2 rounded-lg text-sm font-medium border ${config.quantity === q ? 'bg-primary-900 text-white border-primary-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                         >
                           {q}
                         </button>
                       ))}
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Finish</label>
                    <select 
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent-purple focus:border-transparent outline-none"
                      value={config.finish}
                      onChange={(e) => setConfig({...config, finish: e.target.value})}
                    >
                      <option value="None">None</option>
                      <option value="Matte Lamination">Matte Lamination</option>
                      <option value="Gloss Lamination">Gloss Lamination</option>
                      <option value="Gold Foil">Gold Foil</option>
                    </select>
                  </div>
                </div>

                {/* Same Day Indicator */}
                <div className="flex items-center space-x-2 bg-blue-50 text-blue-800 px-4 py-3 rounded-xl text-sm font-medium">
                  <Clock size={18} />
                  <span>Available for Same-Day Printing if ordered in 2h 15m</span>
                </div>

              </div>

              {/* Bottom Action Bar */}
              <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Estimate</p>
                  <p className="text-3xl font-bold text-primary-900">AED {price}</p>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="bg-accent-purple text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300 flex items-center"
                >
                  Print Now <ArrowRight size={20} className="ml-2" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Checkout Page
const CheckoutPage = ({ cart, placeOrder }: { cart: CartItem[], placeOrder: () => void }) => {
  const [method, setMethod] = useState<DeliveryMethod>(DeliveryMethod.PICKUP);
  const [success, setSuccess] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder();
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-8">Order #AD-88219 has been placed. You will receive an update shortly.</p>
          <Link to="/" className="block w-full bg-primary-900 text-white py-3 rounded-xl font-bold hover:bg-primary-800">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Start customizing your premium prints today.</p>
        <Link to="/products" className="bg-accent-purple text-white px-8 py-3 rounded-xl font-bold">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary-900 mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order Details Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Method */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Method</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => setMethod(DeliveryMethod.PICKUP)}
                  className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center space-x-3 transition-all ${method === DeliveryMethod.PICKUP ? 'border-accent-purple bg-purple-50 text-accent-purple' : 'border-gray-200 text-gray-500'}`}
                >
                  <MapPin size={20} /> <span className="font-semibold">Store Pickup</span>
                </button>
                <button 
                  onClick={() => setMethod(DeliveryMethod.DELIVERY)}
                  className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center space-x-3 transition-all ${method === DeliveryMethod.DELIVERY ? 'border-accent-purple bg-purple-50 text-accent-purple' : 'border-gray-200 text-gray-500'}`}
                >
                  <Truck size={20} /> <span className="font-semibold">Delivery</span>
                </button>
              </div>
            </div>

            {/* Customer Info */}
            <form id="checkout-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-accent-purple" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-accent-purple" placeholder="+971 50 123 4567" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-accent-purple" placeholder="john@company.com" />
                </div>
                {method === DeliveryMethod.DELIVERY && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                    <textarea required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-accent-purple h-24" placeholder="Street, Building, Office No..."></textarea>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Payment</h3>
                 <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <CreditCard size={24} className="text-gray-500" />
                     <span className="font-medium text-gray-700">Credit Card (via Stripe)</span>
                   </div>
                   <div className="w-4 h-4 rounded-full border-2 border-accent-purple bg-accent-purple"></div>
                 </div>
              </div>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{item.product.name}</p>
                      <p className="text-gray-500 text-xs">{item.config.quantity}x, {item.config.size}</p>
                    </div>
                    <p className="font-medium text-gray-900">AED {item.totalPrice}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>AED {total}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>VAT (5%)</span>
                  <span>AED {(total * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{method === DeliveryMethod.DELIVERY ? 'AED 20' : 'Free'}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4 mb-8">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>AED {(total * 1.05 + (method === DeliveryMethod.DELIVERY ? 20 : 0)).toFixed(2)}</span>
                </div>
              </div>
              <button form="checkout-form" className="w-full bg-accent-purple text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. Product List Page (Simple wrapper for demo)
const ProductsListPage = () => {
  return (
    <div className="pt-8 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-primary-900 mb-8">All Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
             <Link to={`/products/${product.id}`} key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
               <div className="h-64 overflow-hidden relative">
                 <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary-900 text-xs font-bold px-3 py-1 rounded-full">
                   From AED {product.basePrice}
                 </div>
               </div>
               <div className="p-6">
                 <div className="text-xs font-semibold text-accent-purple uppercase tracking-wider mb-2">{product.category}</div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                 <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                 <div className="flex items-center text-primary-900 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                   Customize Now <ArrowRight size={16} className="ml-2" />
                 </div>
               </div>
             </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- APP ROOT ---
const App = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart([...cart, item]);
  };

  const placeOrder = () => {
    setCart([]);
  };

  return (
    <HashRouter>
      <div className="min-h-screen font-sans text-gray-900 bg-white">
        <Navbar cartCount={cart.length} />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsListPage />} />
          <Route path="/products/:id" element={<ProductPage addToCart={addToCart} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} placeOrder={placeOrder} />} />
        </Routes>
        
        <footer className="bg-primary-900 text-gray-400 py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 text-white mb-4">
                  <Printer size={24} />
                  <span className="text-xl font-bold">ABU DHABI PRINT PRO</span>
                </div>
                <p className="text-sm max-w-xs">Premium printing services for businesses and individuals. Quality you can trust, speed you can rely on.</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/products" className="hover:text-accent-cyan">Business Cards</Link></li>
                  <li><Link to="/products" className="hover:text-accent-cyan">Flyers & Brochures</Link></li>
                  <li><Link to="/products" className="hover:text-accent-cyan">Large Format</Link></li>
                  <li><a href="#" className="hover:text-accent-cyan">Track Order</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Contact</h4>
                <ul className="space-y-2 text-sm">
                  <li>support@adprintpro.ae</li>
                  <li>+971 2 123 4567</li>
                  <li>Al Reem Island, Abu Dhabi</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
              © 2024 Abu Dhabi Print Pro. All rights reserved.
            </div>
          </div>
        </footer>

        <AIAssistant />
      </div>
    </HashRouter>
  );
};

export default App;
