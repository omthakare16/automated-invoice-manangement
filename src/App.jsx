import { useSelector } from 'react-redux'
import { Upload, FileText, Users, Package } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/ThemeToggle"
import FileUpload from './components/FileUpload'
import InvoicesTable from './components/InvoicesTable'
import ProductsTable from './components/ProductsTable'
import CustomersTable from './components/CustomersTable'

function App() {
  const error = useSelector(state => state.invoices.error)

  return (
    <ThemeProvider storageKey="invoice-theme">
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              Invoice Management System
            </h1>
            <ThemeToggle />
          </div>
          
          {/* File Upload Section */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload />
              {error && (
                <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md text-sm">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Card className="border-border">
            <Tabs defaultValue="invoices" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="invoices" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Invoices
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Customers
                </TabsTrigger>
              </TabsList>
              
              <CardContent className="pt-6">
                <TabsContent value="invoices">
                  <InvoicesTable />
                </TabsContent>
                <TabsContent value="products">
                  <ProductsTable />
                </TabsContent>
                <TabsContent value="customers">
                  <CustomersTable />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
