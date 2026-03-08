import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PageContainer from '../components/PageContainer';

/**
 * MainLayout Component
 * 
 * Purpose:
 * Composition layout that wraps all protected pages with consistent UI structure.
 * 
 * Why Layout Wrappers Are Used in React:
 * 
 * 1. CONSISTENCY
 *    Every page automatically gets the same navigation, header, and styling
 * 
 * 2. DRY (Don't Repeat Yourself)
 *    Write Navbar/Sidebar once, use on all pages
 * 
 * 3. MAINTAINABILITY
 *    Change navigation in one place, updates everywhere
 * 
 * 4. COMPOSITION PATTERN
 *    Children prop allows flexibility - any page content can be wrapped
 * 
 * 5. SEPARATION OF CONCERNS
 *    Layout logic separate from page business logic
 * 
 * Layout Structure:
 * ┌─────────────────────────────────────┐
 * │  Sidebar (fixed left)               │
 * │  ┌──────────────────────────────┐   │
 * │  │  Navbar (top)                │   │
 * │  │  ┌────────────────────────┐  │   │
 * │  │  │  PageContainer         │  │   │
 * │  │  │  (your page content)   │  │   │
 * │  │  │                        │  │   │
 * │  │  └────────────────────────┘  │   │
 * │  └──────────────────────────────┘   │
 * └─────────────────────────────────────┘
 * 
 * Props:
 * - children: The page content to render
 * 
 * Usage in App.jsx:
 * <ProtectedRoute>
 *   <MainLayout>
 *     <DashboardPage />
 *   </MainLayout>
 * </ProtectedRoute>
 */
function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Fixed on left */}
      <Sidebar />

      {/* Main content area - Offset by sidebar width (w-64 = 256px) */}
      <div className="ml-64">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content with Container */}
        <main className="min-h-[calc(100vh-73px)]">
          <PageContainer>
            {children}
          </PageContainer>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
