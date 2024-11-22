import { useSelector } from 'react-redux'

const InvoicesTable = () => {
  const invoices = useSelector(state => state.invoices.invoices)
  const products = useSelector(state => state.products.products)

  const formatNumber = (num) => {
    return Number(num).toFixed(2)
  }

  const calculateTotalCharges = (charges) => {
    if (!charges) return 0
    const { makingCharges = 0, debitCardCharges = 0, shippingCharges = 0, otherCharges = 0 } = charges
    return formatNumber(
      Number(makingCharges) + 
      Number(debitCardCharges) + 
      Number(shippingCharges) + 
      Number(otherCharges)
    )
  }

  // Get number of unique products for each invoice
  const getProductCount = (invoiceId) => {
    return products.filter(product => product.id.includes(invoiceId.split('_')[1])).length
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Serial Number</th>
          <th>Customer Name</th>
          <th>Product Types</th>
          <th>Quantity</th>
          <th>Tax</th>
          <th>Additional Charges</th>
          <th>Total Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice.id}>
            <td>{invoice.serialNumber}</td>
            <td>{invoice.customerName}</td>
            <td>{getProductCount(invoice.id)}</td>
            <td>{formatNumber(invoice.quantity)}</td>
            <td>{formatNumber(invoice.tax)}</td>
            <td>{calculateTotalCharges(invoice.additionalCharges)}</td>
            <td>{formatNumber(invoice.totalAmount)}</td>
            <td>{invoice.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default InvoicesTable 