import { useLocation } from "wouter";
import logoPath from "@assets/IMG_7654_1775333262802.jpeg";

export default function Footer() {
  const [, setLocation] = useLocation();

  let clickTimeout: ReturnType<typeof setTimeout> | null = null;
  let clickCount = 0;

  function handleLogoClick() {
    clickCount++;
    if (clickCount === 1) {
      clickTimeout = setTimeout(() => {
        clickCount = 0;
        setLocation("/");
      }, 300);
    } else if (clickCount === 2) {
      if (clickTimeout) clearTimeout(clickTimeout);
      clickCount = 0;
      setLocation("/admin");
    }
  }

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img
              src={logoPath}
              alt="Lead Superstore"
              className="h-16 w-auto object-contain cursor-pointer select-none mb-4 brightness-90"
              onClick={handleLogoClick}
              onDoubleClick={(e) => {
                e.preventDefault();
                if (clickTimeout) clearTimeout(clickTimeout);
                clickCount = 0;
                setLocation("/admin");
              }}
              data-testid="img-footer-logo"
            />
            <p className="text-sm text-gray-400 leading-relaxed">
              Your premium superstore with everything you need. We deliver quality products at affordable prices.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>Supermarket</li>
              <li>Restaurant</li>
              <li>Bakery & Pastries</li>
              <li>Barbing Salon</li>
              <li>Spa Treatment</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Delivery Info</h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between"><span>Pickup fee:</span><span className="text-white font-medium">₦450</span></p>
              <p className="flex justify-between"><span>Delivery fee:</span><span className="text-white font-medium">₦1,650</span></p>
              <p className="mt-4 text-orange-400 font-medium">We Deliver to Your Doorstep</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Lead Superstore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
