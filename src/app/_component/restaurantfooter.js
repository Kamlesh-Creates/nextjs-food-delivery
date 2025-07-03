import React from "react";

function Restaurantfooter() {
  return (
    <footer className="bg-orange-300 text-black py-6 px-4 w-full">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start text-sm">
        {/* Logo and Tagline */}
        <div>
          <h2 className="text-xl font-bold mb-1">QuickServe</h2>
          <p className="text-xs">Fast, fresh, delivered to your door.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="flex flex-wrap gap-4">
            <li><a href="#" className="hover:text-orange-600">Home</a></li>
            <li><a href="#" className="hover:text-orange-600">Menu</a></li>
            <li><a href="/myorder" className="hover:text-orange-600">Order</a></li>
            <li><a href="/about" className="hover:text-orange-600">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-xs">Email: support@quickserve.com</p>
          <p className="text-xs mb-2">Phone: +91 999999999</p>
          <div className="flex space-x-3">
            <a href="#"><img src="facebook-icon.svg" alt="Facebook" className="h-5 w-5" /></a>
            <a href="#"><img src="instagram-icon.svg" alt="Instagram" className="h-5 w-5" /></a>
            <a href="#"><img src="twitter-icon.svg" alt="Twitter" className="h-5 w-5" /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-orange-400 mt-6 pt-2 text-center text-s">
        <p>© 2025 QuickServe. All rights reserved.</p>
        <p className="text-xl">
          Developed by{" "}
          <a
            href="https://github.com/Kamlesh-Creates"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline font-medium"
          >
            Kamlesh Satpute
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Restaurantfooter;
