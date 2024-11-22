import { useState } from 'react'
import { useSelector } from 'react-redux'
import FileUpload from './components/FileUpload'
import TabPanel from './components/TabPanel'
import InvoicesTable from './components/InvoicesTable'
import ProductsTable from './components/ProductsTable'
import CustomersTable from './components/CustomersTable'
import './App.css'

function App() {
  const [currentTab, setCurrentTab] = useState(0)
  const error = useSelector(state => state.invoices.error)

  const handleTabChange = (tabIndex) => {
    setCurrentTab(tabIndex)
  }

  return (
    <div className="app-container">
      <h1>Invoice Management System</h1>
      
      {/* File Upload Section */}
      <section className="upload-section">
        <h2>Upload Documents</h2>
        <FileUpload />
        {error && <div className="error-message">{error}</div>}
      </section>

      {/* Tabs Navigation */}
      <div className="tabs-navigation">
        <button 
          className={currentTab === 0 ? 'active' : ''} 
          onClick={() => handleTabChange(0)}
        >
          Invoices
        </button>
        <button 
          className={currentTab === 1 ? 'active' : ''} 
          onClick={() => handleTabChange(1)}
        >
          Products
        </button>
        <button 
          className={currentTab === 2 ? 'active' : ''} 
          onClick={() => handleTabChange(2)}
        >
          Customers
        </button>
      </div>

      {/* Tab Panels */}
      <div className="tab-panels">
        <TabPanel value={currentTab} index={0}>
          <InvoicesTable />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <ProductsTable />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <CustomersTable />
        </TabPanel>
      </div>
    </div>
  )
}

export default App
