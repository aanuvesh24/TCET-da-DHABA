import React, { useState, useEffect, useMemo } from 'react';
import { 
  UtensilsCrossed, 
  ChefHat, 
  Smartphone, 
  Search, 
  Flame, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  BellRing, 
  Receipt, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  Sparkles, 
  ChevronRight,
  X,
  Volume2,
  RefreshCw,
  SlidersHorizontal,
  FlameKindling
} from 'lucide-react';

// Types
type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  diet: 'veg' | 'non-veg';
  spicy: boolean;
  rating: number;
  description: string;
  image: string;
  popular?: boolean;
};

type OrderItem = {
  name: string;
  qty: number;
  notes: string;
};

type Order = {
  id: string;
  table: string;
  section: string;
  time: string;
  timestamp: number;
  status: 'incoming' | 'cooking' | 'ready' | 'served';
  items: OrderItem[];
  notes: string;
  total: number;
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Paneer Tikka Masala',
    category: 'Mains',
    price: 320,
    diet: 'veg',
    spicy: true,
    rating: 4.9,
    description: 'Soft paneer cubes roasted in a tandoor and then tossed in a rich, spicy tomato-onion gravy.',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'm2',
    name: 'Amritsari Kulcha Chole',
    category: 'Mains',
    price: 180,
    diet: 'veg',
    spicy: true,
    rating: 4.8,
    description: 'Crispy stuffed potato kulcha served directly from the tandoor with spicy Punjabi chole.',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'm3',
    name: 'Butter Chicken',
    category: 'Mains',
    price: 350,
    diet: 'non-veg',
    spicy: false,
    rating: 4.9,
    description: 'Tender chicken tikka cooked in a velvety tomato and cashew gravy, finished with kasoori methi.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b6ae398?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'm4',
    name: 'Tandoori Chicken (Half)',
    category: 'Starters',
    price: 280,
    diet: 'non-veg',
    spicy: true,
    rating: 4.7,
    description: 'Classic dhaba-style tandoori chicken marinated in yogurt and rustic spices, served with mint chutney.',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm5',
    name: 'Hara Bhara Kebab',
    category: 'Starters',
    price: 220,
    diet: 'veg',
    spicy: false,
    rating: 4.6,
    description: 'Pan-fried patties of spinach, peas, and potatoes packed with fresh herbs.',
    image: 'https://images.unsplash.com/photo-1565557618462-23c316279f64?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm6',
    name: 'Punjabi Lassi (Kulhad)',
    category: 'Drinks',
    price: 80,
    diet: 'veg',
    spicy: false,
    rating: 4.9,
    description: 'Thick, creamy, and sweet yogurt drink churned the traditional way, topped with a dollop of malai.',
    image: 'https://images.unsplash.com/photo-1626082895617-2c6ad36675ee?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'm7',
    name: 'Masala Chai',
    category: 'Drinks',
    price: 40,
    diet: 'veg',
    spicy: false,
    rating: 4.8,
    description: 'Kadak chai brewed with fresh crushed ginger, cardamom, and clove.',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm8',
    name: 'Garlic Naan',
    category: 'Breads',
    price: 60,
    diet: 'veg',
    spicy: false,
    rating: 4.8,
    description: 'Soft tandoori bread loaded with minced garlic and fresh coriander.',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm9',
    name: 'Dal Makhani',
    category: 'Mains',
    price: 260,
    diet: 'veg',
    spicy: false,
    rating: 4.9,
    description: 'Black lentils slow-cooked overnight on a tandoor, finished with white butter and cream.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'm10',
    name: 'Gulab Jamun (2 pcs)',
    category: 'Desserts',
    price: 90,
    diet: 'veg',
    spicy: false,
    rating: 4.9,
    description: 'Hot, soft milk dough dumplings soaked in cardamom and saffron infused sugar syrup.',
    image: 'https://images.unsplash.com/photo-1589116812845-66795493b2a5?auto=format&fit=crop&w=600&q=80'
  }
];

const CATEGORIES = ['All', 'Starters', 'Mains', 'Breads', 'Drinks', 'Desserts'];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-101',
    table: 'Table 02',
    section: 'Main Dining',
    time: '6 mins ago',
    timestamp: Date.now() - 360000,
    status: 'cooking',
    items: [
      { name: 'Woodfiemerald Truffle & Funghi Pizza', qty: 1, notes: 'Extra crispy crust' },
      { name: 'Smoked Old Fashioned', qty: 2, notes: '' }
    ],
    notes: 'Customer celebrating an anniversary',
    total: 500
  },
  {
    id: 'ORD-098',
    table: 'Table 07',
    section: 'Patio Bar',
    time: '14 mins ago',
    timestamp: Date.now() - 840000,
    status: 'ready',
    items: [
      { name: 'Prime Wagyu Smash Burger', qty: 2, notes: 'Medium rare, no pickles' },
      { name: 'Spicy Korean Gochujang Wings', qty: 1, notes: 'Extra dipping sauce' }
    ],
    notes: '',
    total: 580
  }
];

export default function App() {
  const [selectedTable, setSelectedTable] = useState(4);
  const [activeView, setActiveView] = useState<'diner' | 'kds'>(window.location.pathname.includes('kds') ? 'kds' : 'diner');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartDrawerOpen, setCartDrawerOpen] = useState<false | 'cart' | 'status'>(false);
  const [specialNotes, setSpecialNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabOrders, setActiveTabOrders] = useState<Order[]>([]);
  const [activeOrderTracker, setActiveOrderTracker] = useState<(Order & { step: number }) | null>(null);

  
  // Kitchen state
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState(false);

  // Dynamic time update
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000); // update every 10s
    return () => clearInterval(timer);
  }, []);

  const playBellSound = () => {
    try {
      // Simple synthetic bell sound using Web Audio API
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.5);
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1);
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const cartItemCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = MENU_ITEMS.find(m => m.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [cart]);

  const taxAmount = cartSubtotal * 0.085;
  const grandTotal = cartSubtotal + taxAmount;

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      const current = prev[itemId] || 0;
      const updated = current + delta;
      if (updated <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: updated };
    });
  };

  const handlePlaceOrder = () => {
    if (cartItemCount === 0) return;

    const orderId = `ORD-${Math.floor(100 + Math.random() * 900)}`;
    const newItems = Object.entries(cart).map(([id, qty]) => {
      const item = MENU_ITEMS.find(m => m.id === id);
      return {
        name: item?.name || 'Unknown',
        qty: qty,
        notes: ''
      };
    });

    const newOrder: Order = {
      id: orderId,
      table: `Table ${selectedTable.toString().padStart(2, '0')}`,
      section: 'Terrace Deck',
      time: 'Just now',
      timestamp: Date.now(),
      status: 'incoming',
      items: newItems,
      notes: specialNotes.trim(),
      total: grandTotal
    };

    // Push to KDS
    setOrders(prev => [newOrder, ...prev]);
    setNewOrderAlert(true);
    playBellSound();
    setTimeout(() => setNewOrderAlert(false), 4000);

    // Track for diner
    setActiveTabOrders(prev => [newOrder, ...prev]);
    setActiveOrderTracker({
      ...newOrder,
      step: 1 // 1: Received, 2: Cooking, 3: Ready, 4: Served
    });

    // Reset cart
    setCart({});
    setSpecialNotes('');
    setCartDrawerOpen(false);
    showToast(`Order #${orderId} fiemerald to the kitchen! 🔥`);
  };

  const advanceOrderStatus = (orderId: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        let nextStatus: 'incoming' | 'cooking' | 'ready' | 'served' = 'cooking';
        if (ord.status === 'incoming') nextStatus = 'cooking';
        else if (ord.status === 'cooking') nextStatus = 'ready';
        else if (ord.status === 'ready') nextStatus = 'served';

        // Synchronize with active diner tracking if it's Table 04
        if (activeOrderTracker && activeOrderTracker.id === orderId) {
          const stepMap: Record<'incoming' | 'cooking' | 'ready' | 'served', number> = { incoming: 1, cooking: 2, ready: 3, served: 4 };
          setActiveOrderTracker(prevTracker => prevTracker ? ({
            ...prevTracker,
            status: nextStatus,
            step: stepMap[nextStatus]
          }) : null);
        }

        return { ...ord, status: nextStatus };
      }
      return ord;
    }));
  };

  const filteemeraldItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-chassis text-text-primary flex flex-col font-sans select-none noise-bg">
      
      {/* Dev Switcher */}
      <button
        onClick={() => {
          const next = activeView === 'diner' ? 'kds' : 'diner';
          setActiveView(next);
          window.history.replaceState({}, '', next === 'kds' ? '/kds' : '/');
        }}
        className="fixed top-4 right-4 z-[100] bg-panel hover:bg-recessed border-transparent text-text-muted text-text-muted border-none px-3 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 transition-all opacity-50 hover:opacity-100"
      >
        {activeView === 'diner' ? <ChefHat className="w-4 h-4 text-accent" /> : <Smartphone className="w-4 h-4 text-accent" />}
        Switch to {activeView === 'diner' ? 'KDS' : 'Diner'}
      </button>

      {toastMessage && (
        <div className="fixed top-16 right-4 z-[90] animate-bounce bg-accent text-text-primary px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium border border-emerald-400/40">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6 bg-chassis">
        {activeView === 'diner' ? (
          <DinerMobileView
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            cart={cart}
            updateQuantity={updateQuantity}
            cartItemCount={cartItemCount}
            cartSubtotal={cartSubtotal}
            grandTotal={grandTotal}
            taxAmount={taxAmount}
            cartDrawerOpen={cartDrawerOpen}
            setCartDrawerOpen={setCartDrawerOpen}
            specialNotes={specialNotes}
            setSpecialNotes={setSpecialNotes}
            handlePlaceOrder={handlePlaceOrder}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteemeraldItems={filteemeraldItems}
            showToast={showToast}
            activeOrderTracker={activeOrderTracker}
            setActiveOrderTracker={setActiveOrderTracker}
          />
        ) : (
          <KitchenDisplayView
            orders={orders}
            advanceOrderStatus={advanceOrderStatus}
            showToast={showToast}
          />
        )}
      </main>


    </div>
  );
}

type DinerMobileViewProps = {
  selectedTable: number;
  setSelectedTable: (val: number) => void;
  cart: Record<string, number>;
  updateQuantity: (id: string, delta: number) => void;
  cartItemCount: number;
  cartSubtotal: number;
  grandTotal: number;
  taxAmount: number;
  cartDrawerOpen: false | 'cart' | 'status';
  setCartDrawerOpen: React.Dispatch<React.SetStateAction<false | 'cart' | 'status'>>;
  specialNotes: string;
  setSpecialNotes: (val: string) => void;
  handlePlaceOrder: () => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filteemeraldItems: MenuItem[];
  showToast: (msg: string) => void;
  activeOrderTracker: (Order & { step: number }) | null;
  setActiveOrderTracker: React.Dispatch<React.SetStateAction<(Order & { step: number }) | null>>;
};

function DinerMobileView({
  selectedTable,
  setSelectedTable,
  cart,
  updateQuantity,
  cartItemCount,
  cartSubtotal,
  grandTotal,
  taxAmount,
  cartDrawerOpen,
  setCartDrawerOpen,
  specialNotes,
  setSpecialNotes,
  handlePlaceOrder,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  filteemeraldItems,
  showToast,
  activeOrderTracker,
  setActiveOrderTracker
}: DinerMobileViewProps) {
  return (
    <div className="w-full max-w-[440px] h-[95vh] w-full max-w-md h-[95vh] bg-chassis shadow-card screw-corners overflow-hidden flex flex-col relative my-4 rounded-[2rem]">
      

      {/* Diner Header & Table Context */}
      <div className="bg-panel border-none p-4 p-4 border-none">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-accent tracking-wide uppercase flex items-center gap-1">
              <span className="text-text-primary font-black tracking-tight">TCET da DHABA</span>
            </span>
            <h1 className="text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
              <div className="relative">
                <select 
                  value={selectedTable} 
                  onChange={(e) => setSelectedTable(Number(e.target.value))}
                  className="bg-transparent border-b border-dashed border-transparent focus:border-amber-600 focus:outline-none appearance-none cursor-pointer pr-4 text-text-primary hover:text-accent transition-colors"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} value={i+1} className="bg-chassis text-sm">
                      Table {(i+1).toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-text-muted">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
              <span className="text-[11px] font-medium  text-accent px-2 py-0.5 rounded-full border border-emerald-500/30">
                Terrace Deck
              </span>
            </h1>
          </div>

          {/* Quick Staff Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => showToast(`🔔 Waiter has been notified for Table ${selectedTable.toString().padStart(2, '0')}!`)}
              title="Call Waiter"
              className="p-2 bg-panel hover:bg-recessed border-transparent text-text-muted border-none rounded-xl text-text-muted transition-colors"
            >
              <BellRing className="w-4 h-4 text-accent" />
            </button>
            <button
              onClick={() => showToast('🧾 Bill request sent to the cashier!')}
              title="Request Bill"
              className="p-2 bg-panel hover:bg-recessed border-transparent text-text-muted border-none rounded-xl text-text-muted transition-colors"
            >
              <Receipt className="w-4 h-4 text-accent" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -tranzinc-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search truffle pasta, wings, cocktails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-recessed shadow-recessed border-none rounded-xl text-xs text-text-primary placeholder-zinc-400 focus:outline-none focus:border-amber-600 transition-colors"
          />
        </div>
      </div>

      {}
      <div className="flex gap-2 overflow-x-auto px-4 py-2.5 bg-chassis border-none no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-accent text-zinc-950 shadow-md shadow-amber-600/20 font-bold'
                : 'bg-chassis text-text-muted hover:text-text-primary hover:bg-recessed/80 border-none'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 pb-28">
        {filteemeraldItems.map(item => {
          const qty = cart[item.id] || 0;
          return (
            <div
              key={item.id}
              className="bg-chassis rounded-xl shadow-card border-none p-3 flex gap-3 hover:border-transparent transition-all shadow-sm"
            >
              {/* Food Thumbnail */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-chassis">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {item.popular && (
                  <span className="absolute top-1 left-1 bg-accent text-zinc-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                    HOT
                  </span>
                )}
              </div>

              {/* Dish Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {/* Diet icon */}
                    <span 
                      className={`inline-flex items-center justify-center w-3 h-3 border rounded-sm p-[2px] ${
                        item.diet === 'veg' ? 'border-emerald-500' : 'border-rose-500'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.diet === 'veg' ? 'bg-accent' : 'bg-rose-500'}`} />
                    </span>

                    {item.spicy && (
                      <span className="flex items-center text-[10px] text-text-primary font-mono font-bold">
                        <Flame className="w-3 h-3 fill-emerald-400" />
                      </span>
                    )}

                    <h2 className="text-xs font-mono font-bold text-text-primary tracking-tight line-clamp-1">
                      {item.name}
                    </h2>
                  </div>

                  <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Price and Add to Cart Stepper */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-black text-accent">
                    ₹{Math.round(item.price)}
                  </span>

                  {qty === 0 ? (
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-3 py-1  hover:bg-accent text-text-primary font-mono hover:text-zinc-950 text-xs font-bold rounded-lg border border-amber-600/40 transition-all flex items-center gap-1 active:scale-95"
                    >
                      <Plus className="w-3 h-3" /> ADD
                    </button>
                  ) : (
                    <div className="flex items-center bg-chassis border border-amber-600/60 rounded-lg p-0.5 shadow">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-accent hover: rounded active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold text-text-primary">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-accent hover: rounded active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteemeraldItems.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No culinary creations match your query.</p>
          </div>
        )}
      </div>

      {}
      <div className="absolute bottom-3 left-4 right-4 flex flex-col gap-2 z-20">
        {/* Live Active Order Status Pill (if placed) */}
        {activeOrderTracker && (
          <button
            onClick={() => setCartDrawerOpen('status')}
            className="w-full bg-panel backdrop-blur border border-amber-600/40 p-2.5 rounded-xl shadow-card flex items-center justify-between text-xs shadow-lg animate-pulse"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              <span className="text-text-muted font-semibold">Active Order #{activeOrderTracker.id}</span>
            </div>
            <div className="flex items-center gap-1 text-accent font-bold">
              <span>{activeOrderTracker.status.toUpperCase()}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        )}

        {/* Cart Drawer Trigger */}
        {cartItemCount > 0 && (
          <button
            onClick={() => setCartDrawerOpen('cart')}
            className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-zinc-950 font-black p-3.5 rounded-xl shadow-card flex items-center justify-between shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2">
              <div className="bg-chassis text-text-primary text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {cartItemCount}
              </div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-zinc-950">View Table Cart</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-black">
              <span>₹{Math.round(cartSubtotal)}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </button>
        )}
      </div>

      {}
      {cartDrawerOpen && (
        <div className="absolute inset-0 bg-chassis backdrop-blur-sm z-30 flex flex-col justify-end transition-all">
          <div className="bg-chassis border-none rounded-t-[32px] p-5 max-h-[85%] flex flex-col shadow-2xl">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-none">
              <div className="flex items-center gap-2">
                {cartDrawerOpen === 'status' ? (
                  <Clock className="w-5 h-5 text-accent" />
                ) : (
                  <ShoppingBag className="w-5 h-5 text-accent" />
                )}
                <h3 className="font-bold text-text-primary text-sm">
                  {cartDrawerOpen === 'status' ? 'Live Order Progress' : `Table ${selectedTable.toString().padStart(2, '0')} Order Tray`}
                </h3>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="w-7 h-7 bg-chassis rounded-full flex items-center justify-center text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body: Cart Items */}
            {cartDrawerOpen === 'cart' && (
              <div className="flex-1 overflow-y-auto py-3 space-y-3">
                {Object.entries(cart).map(([id, qty]) => {
                  const item = MENU_ITEMS.find(m => m.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="flex items-center justify-between bg-chassis p-2.5 rounded-xl border-none">
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-semibold text-text-primary">{item.name}</p>
                        <p className="text-[11px] text-accent">₹{Math.round(item.price)} each</p>
                      </div>
                      <div className="flex items-center bg-chassis border-none rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-text-primary"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-text-primary">{Number(qty)}</span>
                        <button
                          onClick={() => updateQuantity(id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-text-primary"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Chef Notes Input */}
                <div className="pt-2">
                  <label className="text-[11px] font-semibold text-text-muted flex items-center gap-1 mb-1">
                    Kitchen Notes &amp; Allergies
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Extra spicy, sauce on the side, allergic to shellfish..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full bg-chassis border-none rounded-xl p-2.5 text-xs text-text-primary placeholder-zinc-500 focus:outline-none focus:border-amber-600 resize-none"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="bg-chassis p-3 rounded-xl border-none space-y-1.5 text-xs">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal</span>
                    <span>₹{Math.round(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Estimated Tax (8.5%)</span>
                    <span>₹{Math.round(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-text-primary font-black text-sm pt-1.5 border-none">
                    <span>Total Bill</span>
                    <span className="text-accent">₹{Math.round(grandTotal)}</span>
                  </div>
                </div>

                {/* Fire to Kitchen CTA */}
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-zinc-950 font-black rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  <ChefHat className="w-4 h-4" /> Send Order to Kitchen
                </button>
              </div>
            )}

            {/* Drawer Body: Live Status Progress Tracker */}
            {cartDrawerOpen === 'status' && activeOrderTracker && (
              <div className="py-4 space-y-6">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                    Order Reference: #{activeOrderTracker.id}
                  </span>
                  <h4 className="text-lg font-extrabold text-text-primary mt-0.5">
                    {activeOrderTracker.status === 'incoming' && 'Order Received by Kitchen'}
                    {activeOrderTracker.status === 'cooking' && 'Chef is Preparing your Meal'}
                    {activeOrderTracker.status === 'ready' && 'Order is Plated & Ready!'}
                    {activeOrderTracker.status === 'served' && 'Served at your Table'}
                  </h4>
                  <p className="text-xs text-text-muted mt-1">Table {selectedTable.toString().padStart(2, '0')} &bull; Terrace Section</p>
                </div>

                {/* Progress Timeline Stepper */}
                <div className="space-y-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activeOrderTracker.step >= 1 ? 'bg-accent text-zinc-950' : 'bg-chassis text-text-muted'
                    }`}>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <p className="text-xs font-mono font-bold text-text-primary">Order Received</p>
                      <p className="text-[11px] text-text-muted">Order sent directly to kitchen station</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activeOrderTracker.step >= 2 ? 'bg-accent text-zinc-950' : 'bg-chassis text-text-muted'
                    }`}>
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-mono font-bold text-text-primary">Cooking / In the Kitchen</p>
                      <p className="text-[11px] text-text-muted">Hot items in progress on the line</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activeOrderTracker.step >= 3 ? 'bg-accent text-zinc-950' : 'bg-chassis text-text-muted'
                    }`}>
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-mono font-bold text-text-primary">Ready for Runner</p>
                      <p className="text-[11px] text-text-muted">Plated and en route to Table {selectedTable.toString().padStart(2, '0')}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    className="w-full py-2.5 bg-panel hover:bg-recessed border-transparent text-text-muted text-text-muted font-semibold rounded-xl text-xs transition-colors"
                  >
                    Add More Items to This Tab
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

type KitchenDisplayViewProps = {
  orders: Order[];
  advanceOrderStatus: (id: string) => void;
  showToast: (msg: string) => void;
};

function KitchenDisplayView({ orders, advanceOrderStatus, showToast }: KitchenDisplayViewProps) {
  const incoming = orders.filter(o => o.status === 'incoming');
  const cooking = orders.filter(o => o.status === 'cooking');
  const ready = orders.filter(o => o.status === 'ready');

  return (
    <div className="w-full max-w-7xl h-[95vh] flex flex-col bg-chassis overflow-hidden rounded-3xl border-none shadow-2xl p-4 my-4 gap-4">
        {/* KDS Control Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-panel border-none p-4 border-none p-4 rounded-xl shadow-card gap-3 shadow-md shrink-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5  text-accent rounded-xl border border-emerald-600/30">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-text-primary tracking-wide">DHABA CHULHA (KDS)</h2>
            <p className="text-xs text-text-muted">Garam Garam Orders (Live) &bull; Auto-sync enabled</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-chassis px-3 py-1.5 rounded-xl border-none text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
            <span className="text-text-muted font-medium">Station: Tandoor &amp; Chulha</span>
          </div>
          <button
            onClick={() => showToast('Kitchen test alert chimed! 🔔')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-panel hover:bg-recessed border-transparent text-text-muted border-none rounded-xl text-xs text-text-muted font-medium transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-accent" /> Test Bell
          </button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
        
        {/* Column 1: Incoming / New Orders */}
        <div className="bg-recessed shadow-recessed border border-amber-600/30 rounded-xl shadow-card flex flex-col overflow-hidden">
          <div className="bg-panel shadow-sharp border-b border-border-shadow px-4 py-3 border-b border-amber-600/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent"></span>
              <h3 className="font-extrabold text-sm text-accent">NAYE ORDERS</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5  text-text-primary font-mono rounded-full">
              {incoming.length}
            </span>
          </div>

          <div className="p-3 overflow-y-auto space-y-3 flex-1">
            {incoming.map(order => (
              <TicketCard 
                key={order.id} 
                order={order} 
                actionText="Start Cooking" 
                actionColor="bg-accent hover:bg-accent text-zinc-950"
                onAction={() => advanceOrderStatus(order.id)} 
              />
            ))}
            {incoming.length === 0 && (
              <div className="h-44 flex flex-col items-center justify-center text-text-muted text-xs">
                <CheckCircle2 className="w-6 h-6 mb-1 text-text-muted" />
                No incoming tickets waiting.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: In Preparation / Cooking */}
        <div className="bg-recessed shadow-recessed border border-blue-500/30 rounded-xl shadow-card flex flex-col overflow-hidden">
          <div className="bg-panel shadow-sharp border-b border-border-shadow px-4 py-3 border-b border-blue-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent"></span>
              <h3 className="font-extrabold text-sm text-accent">IN PREPARATION</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5  text-accent rounded-full">
              {cooking.length}
            </span>
          </div>

          <div className="p-3 overflow-y-auto space-y-3 flex-1">
            {cooking.map(order => (
              <TicketCard 
                key={order.id} 
                order={order} 
                actionText="Mark Plated / Ready" 
                actionColor="bg-accent hover:bg-accent text-text-primary"
                onAction={() => advanceOrderStatus(order.id)} 
              />
            ))}
            {cooking.length === 0 && (
              <div className="h-44 flex flex-col items-center justify-center text-text-muted text-xs">
                <ChefHat className="w-6 h-6 mb-1 text-text-muted" />
                Line is clear. No active cooking.
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Ready to Serve */}
        <div className="bg-recessed shadow-recessed border border-emerald-500/30 rounded-xl shadow-card flex flex-col overflow-hidden">
          <div className="bg-panel shadow-sharp border-b border-border-shadow px-4 py-3 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent"></span>
              <h3 className="font-extrabold text-sm text-text-primary font-mono">TAIYAAR!</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5  text-accent rounded-full">
              {ready.length}
            </span>
          </div>

          <div className="p-3 overflow-y-auto space-y-3 flex-1">
            {ready.map(order => (
              <TicketCard 
                key={order.id} 
                order={order} 
                actionText="Dispatch / Served" 
                actionColor="bg-accent hover:bg-accent text-zinc-950"
                onAction={() => advanceOrderStatus(order.id)} 
              />
            ))}
            {ready.length === 0 && (
              <div className="h-44 flex flex-col items-center justify-center text-text-muted text-xs">
                <UtensilsCrossed className="w-6 h-6 mb-1 text-text-muted" />
                All ready dishes picked up.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type TicketCardProps = {
  order: Order;
  actionText: string;
  actionColor: string;
  onAction: () => void;
};

function TicketCard({ order, actionText, actionColor, onAction }: TicketCardProps) {
  // calculate time dynamically based on Date.now() if needed
  const elapsedMins = Math.floor((Date.now() - order.timestamp) / 60000);
  const timeDisplay = elapsedMins === 0 ? 'Just now' : `${elapsedMins} mins ago`;

  return (
    <div className="bg-chassis border-none rounded-xl p-3.5 shadow-md flex flex-col justify-between hover:border-transparent transition-all">
      <div>
        {/* Ticket Header */}
        <div className="flex items-center justify-between pb-2 border-none">
          <div>
            <span className="text-[11px] font-bold text-accent uppercase tracking-wider block">
              {order.id}
            </span>
            <span className="text-sm font-black text-text-primary">
              {order.table}
            </span>
            <span className="text-[10px] text-text-muted ml-1.5">({order.section})</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-text-muted font-medium bg-chassis px-2 py-1 rounded-md border-none">
            <Clock className="w-3 h-3 text-text-muted" />
            <span>{timeDisplay}</span>
          </div>
        </div>

        {/* Item List */}
        <div className="py-2.5 space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="text-xs">
              <div className="flex items-start justify-between font-semibold text-text-muted">
                <span>{item.qty}x {item.name}</span>
              </div>
              {item.notes && (
                <p className="text-[11px] text-text-primary font-mono italic pl-4 mt-0.5">
                  &bull; Note: {item.notes}
                </p>
              )}
            </div>
          ))}

          {/* Kitchen Order-level note */}
          {order.notes && (
            <div className="bg-panel shadow-sharp border-b border-border-shadow border border-amber-600/30 rounded-lg p-2 mt-2">
              <p className="text-[11px] text-text-primary font-mono font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" /> Note: {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Action Button */}
      <button
        onClick={onAction}
        className={`w-full mt-2 py-2 rounded-lg text-xs font-black tracking-wide uppercase transition-all shadow-md active:scale-95 ${actionColor}`}
      >
        {actionText}
      </button>
    </div>
  );
}