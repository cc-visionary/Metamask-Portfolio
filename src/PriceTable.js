import { Button, Table } from 'antd';

export default function PriceTable({data, removeItem, ...props}) {
  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (a) => parseFloat(a).toFixed(4), 
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: 'USD',
      dataIndex: 'usd',
      key: 'usd',
      render: (a) => parseFloat(a).toFixed(2), 
      sorter: (a, b) => a.usd - b.usd,
    },
    {
      title: '',
      render: (row, item, i) => <Button onClick={() => removeItem(i)}>Delete</Button>
    }
  ]

  return <Table columns={columns} dataSource={data} pagination={false} />
}