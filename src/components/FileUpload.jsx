import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { addInvoice, setError } from '../store/slices/invoicesSlice'
import { addProduct } from '../store/slices/productsSlice'
import { addCustomer } from '../store/slices/customersSlice'
import * as XLSX from 'xlsx'

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

const FileUpload = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const convertExcelToCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const csvData = XLSX.utils.sheet_to_csv(firstSheet)
          
          // Create a new Blob with CSV data
          const csvBlob = new Blob([csvData], { type: 'text/csv' })
          const csvFile = new File([csvBlob], 'converted.csv', { type: 'text/csv' })
          resolve(csvFile)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = (error) => reject(error)
      reader.readAsBinaryString(file)
    })
  }

  const fileToGenerativePart = async (file) => {
    let processableFile = file

    // Convert Excel files to CSV if needed
    if (file.type.includes('excel') || 
        file.name.endsWith('.xlsx') || 
        file.name.endsWith('.xls')) {
      processableFile = await convertExcelToCSV(file)
    }

    const data = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result.split(',')[1])
      reader.readAsDataURL(processableFile)
    })

    return {
      inlineData: {
        data,
        mimeType: processableFile.type
      }
    }
  }

  const validateExtractedData = (data) => {
    // Default values for different field types
    const defaultValues = {
      text: 'N/A',
      number: '0.00',
      array: [],
      object: {}
    }

    // Define field types
    const fieldTypes = {
      invoice: {
        serialNumber: 'text',
        customerName: 'text',
        productName: 'text',
        totalAmount: 'number',
        quantity: 'number',
        tax: 'number',
        date: 'text',
        additionalCharges: {
          makingCharges: 'number',
          debitCardCharges: 'number',
          shippingCharges: 'number',
          otherCharges: 'number'
        }
      },
      customer: {
        name: 'text',
        phoneNumber: 'text',
        totalPurchaseAmount: 'number'
      },
      product: {
        name: 'text',
        quantity: 'number',
        unitPrice: 'number',
        discount: 'number',
        tax: 'number',
        priceWithTax: 'number'
      }
    }

    // Function to set default values recursively
    const setDefaults = (obj, typeSchema) => {
      Object.entries(typeSchema).forEach(([key, type]) => {
        if (typeof type === 'object') {
          // Handle nested objects
          obj[key] = obj[key] || {}
          setDefaults(obj[key], type)
        } else {
          // Set default value if field is missing or empty
          if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
            obj[key] = defaultValues[type]
          }
        }
      })
    }

    // Set defaults for invoice and customer
    setDefaults(data.invoice, fieldTypes.invoice)
    setDefaults(data.customer, fieldTypes.customer)

    // Handle products array
    if (!Array.isArray(data.products) || data.products.length === 0) {
      throw new Error('Products array is empty or missing')
    }

    // Set defaults for each product
    data.products.forEach(product => {
      setDefaults(product, fieldTypes.product)
    })

    // If productName is not set in invoice, use first product name
    if (data.invoice.productName === 'N/A' && data.products.length > 0) {
      data.invoice.productName = data.products[0].name
    }

    return data // Return the data with defaults applied
  }

  const processFile = async (file) => {
    try {
      const filePart = await fileToGenerativePart(file)
      
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash"
      })

      const result = await model.generateContent([
        filePart,
        {
          text: `Extract invoice information from this document. Extract ALL line items, separating products and charges.
          
          IMPORTANT EXTRACTION RULES:
          1. IGNORE the invoice maker's contact details (phone/email at the top of invoice)
          2. For customer phone number: Look for Mobile, Ph, Contact ONLY in the Consignee/Customer section
          3. For product tax: Calculate as sum of CGST + SGST shown for each product
          4. For total tax: Sum all GST amounts (all CGST + SGST combined)
          5. For priceWithTax: Multiply quantity * unitPrice and add tax amount
          6. All amounts should be numbers without currency symbols
          7. Quantity should be extracted as numbers only
          8. DO NOT MAKE UP OR ASSUME ANY VALUES - if a field is not found, leave it empty

          Return ONLY a valid JSON object with these specific requirements:

          invoice: {
            serialNumber: Invoice/Bill number exactly as shown,
            totalAmount: Final total amount with all taxes and charges,
            quantity: Total items purchased (sum of all product quantities),
            tax: Sum of all GST amounts including all products (all CGST + SGST combined),
            date: Invoice date exactly as shown,
            customerName: Name from Consignee section only,
            productName: Name of the first product only,
            additionalCharges: {
              makingCharges: Amount of making charges (if any),
              debitCardCharges: Amount of debit card charges (if any),
              shippingCharges: Total shipping charges (if any),
              otherCharges: Any other additional charges
            }
          },
          
          products: Array of ONLY actual product items, each containing:
            - name: Full product description
            - quantity: Number of items (numeric only)
            - unitPrice: Base price per item (numeric only)
            - discount: Discount amount (if any, numeric only)
            - tax: GST per product (CGST + SGST, numeric only)
            - priceWithTax: (quantity * unitPrice) - discount + tax
          
          customer: {
            name: Name from Consignee section only,
            phoneNumber: Phone number from Consignee section only (if not found, leave empty),
            totalPurchaseAmount: Same as invoice.totalAmount
          }

          Example structure (with placeholder values):
          {
            "invoice": {
              "serialNumber": "[INVOICE_NUMBER]",
              "customerName": "[CONSIGNEE_NAME]",
              "productName": "[FIRST_PRODUCT_NAME]",
              "totalAmount": "0.00",
              "tax": "0.00",
              "date": "[DATE]",
              "additionalCharges": {
                "makingCharges": "0.00",
                "debitCardCharges": "0.00",
                "shippingCharges": "0.00",
                "otherCharges": "0.00"
              }
            },
            "products": [
              {
                "name": "[PRODUCT_NAME]",
                "quantity": "0",
                "unitPrice": "0.00",
                "discount": "0.00",
                "tax": "0.00",
                "priceWithTax": "0.00"
              }
            ],
            "customer": {
              "name": "[CONSIGNEE_NAME]",
              "phoneNumber": "[CONSIGNEE_PHONE_NUMBER]",
              "totalPurchaseAmount": "0.00"
            }
          }`
        }
      ])

      const response = await result.response
      const responseText = response.candidates[0].content.parts[0].text
      
      // Clean up the response text by removing markdown code blocks
      const cleanedText = responseText
        .replace(/```json\n/g, '')
        .replace(/```\n/g, '')
        .replace(/```/g, '')
        .trim()

      // Parse the cleaned JSON
      const extractedData = JSON.parse(cleanedText)

      // Validate and process the data, now returns data with defaults
      const validatedData = validateExtractedData(extractedData)

      const timestamp = Date.now()
      
      // Create data objects with IDs using validated data
      const dataWithIds = {
        invoice: { 
          ...validatedData.invoice, 
          id: `inv_${timestamp}` 
        },
        customer: { 
          ...validatedData.customer, 
          id: `cust_${timestamp}` 
        }
      }

      // Add IDs to each product and dispatch them individually
      validatedData.products.forEach((product, index) => {
        dispatch(addProduct({
          ...product,
          id: `prod_${timestamp}_${index}`
        }))
      })

      // Dispatch invoice and customer
      dispatch(addInvoice(dataWithIds.invoice))
      dispatch(addCustomer(dataWithIds.customer))

    } catch (error) {
      throw new Error(`Data extraction failed: ${error.message}`)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setLoading(true)
    try {
      await processFile(file)
    } catch (error) {
      console.error('Error processing file:', error)
      dispatch(setError(error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv"
        onChange={handleFileUpload}
        disabled={loading}
      />
      {loading && <div>Processing file...</div>}
    </div>
  )
}

export default FileUpload 