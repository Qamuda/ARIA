import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Insights from './pages/Insights'
import TryARIA from './pages/TryARIA'
import About from './pages/About'
import Settings from './pages/Settings'

import { IMAGES } from './config/images'
import './index.css'

// Tab indices. Keep these in sync with the <Tab> / <TabPanel> order below.
const TAB = { HOME: 0, DASHBOARD: 1, INSIGHTS: 2, TRY: 3, ABOUT: 4, SETTINGS: 5 }

function App() {
  const [tabIndex, setTabIndex] = useState(TAB.HOME)

  return (
    <div className="app">
      <header className="brand">
        {IMAGES.brandLogo && (
          <img src={IMAGES.brandLogo} alt="ARIA logo" className="brand-logo" />
        )}
        <div className="brand-text">
          <span className="brand-name">A.R.I.A</span>
          <span className="brand-sub">Adaptive Routine Intelligence</span>
        </div>
      </header>

      <Tabs selectedIndex={tabIndex} onSelect={setTabIndex}>
        <TabList>
          <Tab>Home</Tab>
          <Tab>Dashboard</Tab>
          <Tab>Insights</Tab>
          <Tab>Try ARIA</Tab>
          <Tab>About</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanel><Home onNavigate={setTabIndex} tabMap={TAB} /></TabPanel>
        <TabPanel><Dashboard /></TabPanel>
        <TabPanel><Insights /></TabPanel>
        <TabPanel><TryARIA /></TabPanel>
        <TabPanel><About /></TabPanel>
        <TabPanel><Settings /></TabPanel>
      </Tabs>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
