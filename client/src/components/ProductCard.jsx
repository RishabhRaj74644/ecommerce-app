import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice.js'
import { toast } from 'react-toastify'
import StarRating from './StarRating.jsx'
import useAuth from '../hooks/useAuth.js'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = async (e) => {
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.info('First login please..!')
      navigate('/login')
      return
    }

    try {
      await dispatch(addToCart({
        productId: product._id,
        quantity: 1,
      })).unwrap()
      toast.success('Added in Cart !')
    } catch (err) {
      toast.error(err || 'There is something problem')
    }
  }

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#ffffff',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <img
        src={product.images?.[0] || 'https://via.placeholder.com/300'}
        alt={product.name}
        style={{
          width: '100%',
          height: '220px',
          objectFit: 'cover',
        }}
      />

      <div style={{ padding: '16px' }}>
        <p style={{
          fontSize: '12px',
          color: '#718096',
          marginBottom: '4px',
          textTransform: 'uppercase',
        }}>
          {product.category?.name || 'Category'}
        </p>

        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '8px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {product.name}
        </h3>

        <StarRating
          rating={product.rating}
          numReviews={product.numReviews}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
        }}>
          <span style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#111111',
          }}>
            ₹{product.price}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              padding: '8px 16px',
              background: product.stock === 0
                ? '#e2e8f0' : '#111111',
              color: product.stock === 0
                ? '#718096' : '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: product.stock === 0
                ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard