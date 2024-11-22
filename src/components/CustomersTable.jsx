import { useSelector } from 'react-redux'

const CustomersTable = () => {
  const customers = useSelector(state => state.customers.customers)

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Phone Number</th>
          <th>Total Purchase Amount</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.name}</td>
            <td>{customer.phoneNumber}</td>
            <td>{customer.totalPurchaseAmount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomersTable 