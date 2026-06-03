import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios.js'
import ProductCard from '../components/ProductCard.jsx'
import Loader from '../components/Loader.jsx'

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts]   = useState([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)

  const keyword  = searchParams.get('keyword') || ''
  const page     = Number(searchParams.get('page')) || 1
  const sort     = searchParams.get('sort') || '-createdAt'
  const minPrice = searchParams.get('price[gte]') || ''
  const maxPrice = searchParams.get('price[lte]') || ''

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()

        if (keyword)  params.set('keyword', keyword)
        if (minPrice) params.set('price[gte]', minPrice)
        if (maxPrice) params.set('price[lte]', maxPrice)

        params.set('page', page)
        params.set('sort', sort)
        params.set('limit', 12)

        const { data } = await api.get(`/products?${params}`)

        setProducts(data.products)
        setTotal(data.total)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  const totalPages = Math.ceil(total / 12)

  const handleSearch = (e) => {
    e.preventDefault()
    const keyword = e.target.keyword.value
    setSearchParams({ keyword, page: 1 })
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px',
    }}>

      <h1 style={{
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '24px',
      }}>
        All Products
      </h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        <input
          name="keyword"
          defaultValue={keyword}
          placeholder="Find Product ..."
          style={{
            flex: 1,
            padding: '10px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '200px',
            outline: 'none',
          }}
        />
        <button type="submit" style={{
          padding: '10px 24px',
          background: '#111111',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
        }}>
          Search
        </button>
      </form>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <input
          type="number"
          placeholder="Min ₹"
          defaultValue={minPrice}
          onBlur={(e) => {
            const params = Object.fromEntries(searchParams)
            setSearchParams({
              ...params,
              'price[gte]': e.target.value,
              page: 1,
            })
          }}
          style={filterInputStyle}
        />

        <input
          type="number"
          placeholder="Max ₹"
          defaultValue={maxPrice}
          onBlur={(e) => {
            const params = Object.fromEntries(searchParams)
            setSearchParams({
              ...params,
              'price[lte]': e.target.value,
              page: 1,
            })
          }}
          style={filterInputStyle}
        />

        <select
          value={sort}
          onChange={(e) => {
            const params = Object.fromEntries(searchParams)
            setSearchParams({ ...params, sort: e.target.value })
          }}
          style={filterInputStyle}
        >
          <option value="-createdAt">New first</option>
          <option value="price">Price: less to more</option>
          <option value="-price">Price: more to less</option>
          <option value="-rating">Top Rated</option>
        </select>

        <span style={{ fontSize: '14px', color: '#718096' }}>
          {total} products Found
        </span>
      </div>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 0',
          color: '#718096',
        }}>
          <p style={{ fontSize: '18px' }}>
            Not any Product Founded
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '48px',
        }}>
          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => {
                const params = Object.fromEntries(searchParams)
                setSearchParams({ ...params, page: pageNum })
              }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                background: pageNum === page
                  ? '#111111' : '#ffffff',
                color: pageNum === page
                  ? '#ffffff' : '#333333',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: pageNum === page ? '600' : '400',
              }}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}

const filterInputStyle = {
  padding: '10px 14px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
}

export default ProductList