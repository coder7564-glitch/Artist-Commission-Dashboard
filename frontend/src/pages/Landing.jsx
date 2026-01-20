import { Link } from 'react-router-dom'

export default function Landing() {
    const features = [
        {
            icon: '🎨',
            title: 'Commission Management',
            description: 'Track all your commissions from request to delivery with our intuitive dashboard.'
        },
        {
            icon: '💳',
            title: 'Secure Payments',
            description: 'Handle payments safely with built-in invoicing and transaction tracking.'
        },
        {
            icon: '📊',
            title: 'Analytics & Insights',
            description: 'Get detailed reports on your earnings, clients, and performance metrics.'
        },
        {
            icon: '🔔',
            title: 'Real-time Updates',
            description: 'Stay informed with instant notifications on commission status changes.'
        }
    ]

    const categories = [
        { name: 'Digital Art', icon: '🖼️', count: '500+' },
        { name: 'Character Design', icon: '👤', count: '350+' },
        { name: 'Illustration', icon: '✏️', count: '420+' },
        { name: 'Logo Design', icon: '💎', count: '280+' },
        { name: 'Animation', icon: '🎬', count: '150+' },
        { name: 'UI/UX Design', icon: '📱', count: '200+' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900">ArtistHub</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                        <a href="#categories" className="text-gray-600 hover:text-gray-900 transition-colors">Categories</a>
                        <a href="#dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">Dashboard</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-full font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-6">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                Platform for Creative Professionals
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                Connect with
                                <span className="bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent"> Talented Artists</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                The ultimate platform for managing art commissions. Whether you're an artist or a client,
                                streamline your creative workflow with ArtistHub.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all text-lg"
                                >
                                    Start Free Trial
                                </Link>
                                <a
                                    href="#features"
                                    className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all text-lg"
                                >
                                    Learn More
                                </a>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-12 mt-12 pt-8 border-t border-gray-100">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">2.5K+</div>
                                    <div className="text-gray-500">Active Artists</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">15K+</div>
                                    <div className="text-gray-500">Commissions</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">98%</div>
                                    <div className="text-gray-500">Satisfaction</div>
                                </div>
                            </div>
                        </div>

                        {/* Digital Artist Character */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-violet-100 rounded-3xl transform rotate-3"></div>
                            <div className="relative">
                                <img
                                    src="/characters/Digital Artist Character.png"
                                    alt="Digital Artist"
                                    className="w-full max-w-lg mx-auto drop-shadow-2xl"
                                />
                                {/* Floating UI Cards */}
                                <div className="absolute top-10 -left-4 p-4 bg-white rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <span className="text-emerald-600">✓</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">New Order!</div>
                                            <div className="text-sm text-gray-500">Character Design</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-20 -right-4 p-4 bg-white rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '4s' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                                            <span className="text-violet-600">$</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">+$250.00</div>
                                            <div className="text-sm text-gray-500">Payment Received</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Graphic Designer Character */}
                        <div className="relative order-2 lg:order-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl"></div>
                            <img
                                src="/characters/Graphic Designer Character.png"
                                alt="Graphic Designer"
                                className="relative w-full max-w-md mx-auto drop-shadow-xl"
                            />
                            {/* Feature Icons */}
                            <div className="absolute top-8 right-8 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                                <span className="text-2xl">🎨</span>
                            </div>
                            <div className="absolute bottom-32 left-4 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                                <span className="text-2xl">⚙️</span>
                            </div>
                            <div className="absolute bottom-8 right-16 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                                <span className="text-2xl">🎯</span>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-amber-600 text-sm font-medium mb-6">
                                Powerful Features
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Everything you need to manage commissions
                            </h2>
                            <p className="text-lg text-gray-600 mb-10">
                                From tracking orders to receiving payments, ArtistHub provides all the tools you need to run your creative business.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {features.map((feature, index) => (
                                    <div key={index} className="p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                        <div className="text-3xl mb-3">{feature.icon}</div>
                                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                        <p className="text-sm text-gray-600">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section id="categories" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full text-purple-600 text-sm font-medium mb-6">
                            Artist Categories
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Find the perfect artist for your project
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Browse through our diverse categories of talented artists ready to bring your vision to life.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5 transition-all group cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-4xl">{category.icon}</span>
                                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium group-hover:bg-purple-100 transition-colors">
                                        {category.count} Artists
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Painter Character as separator */}
                    <div className="relative flex justify-center">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                        <div className="relative bg-gradient-to-b from-gray-50 to-white px-8">
                            <img
                                src="/characters/Painter Character.png"
                                alt="Painter"
                                className="w-48 h-48 object-contain drop-shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Preview Section */}
            <section id="dashboard" className="py-20 px-6 bg-gray-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-blue-300 text-sm font-medium mb-6">
                                Dashboard Preview
                            </div>
                            <h2 className="text-4xl font-bold mb-6">
                                Powerful analytics at your fingertips
                            </h2>
                            <p className="text-lg text-gray-400 mb-8">
                                Get a complete overview of your business with our intuitive dashboard. Track earnings, monitor commissions, and grow your creative empire.
                            </p>

                            {/* Glassmorphism Stats Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                                    <div className="text-3xl font-bold mb-1">$12.5K</div>
                                    <div className="text-gray-400 text-sm">Monthly Revenue</div>
                                </div>
                                <div className="p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                                    <div className="text-3xl font-bold mb-1">156</div>
                                    <div className="text-gray-400 text-sm">Active Commissions</div>
                                </div>
                                <div className="p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                                    <div className="text-3xl font-bold mb-1">4.9★</div>
                                    <div className="text-gray-400 text-sm">Client Rating</div>
                                </div>
                                <div className="p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                                    <div className="text-3xl font-bold mb-1">98%</div>
                                    <div className="text-gray-400 text-sm">Completion Rate</div>
                                </div>
                            </div>
                        </div>

                        {/* Creative Admin Character */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-3xl blur-3xl"></div>
                            <img
                                src="/characters/Creative Admin Character.png"
                                alt="Creative Admin"
                                className="relative w-full max-w-lg mx-auto drop-shadow-2xl"
                            />
                            {/* Floating Charts */}
                            <div className="absolute top-8 -left-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                                <div className="flex gap-1 h-16 items-end">
                                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                        <div
                                            key={i}
                                            className="w-3 bg-gradient-to-t from-blue-400 to-violet-400 rounded-sm"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute bottom-16 -right-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                                <div className="text-emerald-400 text-sm font-medium">↑ 24%</div>
                                <div className="text-white text-lg font-bold">Growth</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        Ready to transform your creative business?
                    </h2>
                    <p className="text-lg text-gray-600 mb-10">
                        Join thousands of artists and clients who are already using ArtistHub to manage their commissions.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/register"
                            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all text-lg"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            to="/login"
                            className="px-10 py-4 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all text-lg"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900">ArtistHub</span>
                        </div>
                        <div className="text-gray-500 text-sm">
                            © 2026 ArtistHub. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
