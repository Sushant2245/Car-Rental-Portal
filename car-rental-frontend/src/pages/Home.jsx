import HeroSection from '../components/HeroSection';

function Home() {
  return (
    <div>
      <HeroSection />
      
      {/* Additional sections can be added here later */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Why Choose RentWheels?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-semibold mb-2">Instant Booking</h3>
              <p className="text-gray-600">Book your car in just a few clicks</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="font-semibold mb-2">Multiple Locations</h3>
              <p className="text-gray-600">Available in cities nationwide</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Manage bookings on the go</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
