const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold">BookBee</span>
            </div>
            <p className="text-gray-400">
              Your favorite platform for reading and writing amazing stories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Browse</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Write</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {['Twitter', 'Facebook', 'Instagram', 'YouTube'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BookBee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;