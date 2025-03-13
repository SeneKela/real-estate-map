import PropertyMap from "@/components/property-map"
import { PropertySearch } from "@/components/property-search"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white shadow-sm">
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <span className="text-sm font-medium text-gray-900">IBM - La direction de l'immobilier de l'État</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </button>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                MM
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="relative h-[calc(100vh-56px)]">
          <PropertyMap />
          <PropertySearch />
        </div>
      </main>
    </div>
  )
}

