import { useSelector } from 'react-redux'

const ProductsTable = () => {
  const products = useSelector(state => state.products.products)

  const formatNumber = (num) => {
    return Number(num).toFixed(2)
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Discount</th>
          <th>Tax</th>
          <th>Price with Tax</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{formatNumber(product.quantity)}</td>
            <td>{formatNumber(product.unitPrice)}</td>
            <td>{formatNumber(product.discount || 0)}</td>
            <td>{formatNumber(product.tax)}</td>
            <td>{formatNumber(product.priceWithTax)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ProductsTable 