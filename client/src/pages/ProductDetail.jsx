import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice.js'
import { toast } from 'react-toastify'
import api from '../api/axios.js'
import Loader from '../components/Loader.jsx'
import StarRating from '../components/StarRating.jsx'
import useAuth from '../hooks/useAuth.js'

const ProductDetail = () => {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const dispatch    = useDispatch()
  const { isAuthenticated } = useAuth()

  const [product, setProduct]   = useState(null)
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  })

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const { data } = await api.get(`/products/${id}`)

      setProduct(data.product)
      setReviews(data.reviews)
    } catch (err) {
      toast.error('Product not Loaded')
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Login First')
      return navigate('/login')
    }
    try {
      await dispatch(addToCart({
        productId: id,
        quantity,
      })).unwrap()
      toast.success('Added in Cart.!')
    } catch (err) {
      toast.error(err || 'There is somthing Problem')
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.info('first login please.. before giving the Review ')
      return navigate('/login')
    }
    try {
      await api.post(`/products/${id}/reviews`, reviewForm)

      toast.success('Review submited!')
      setReviewForm({ rating: 5, comment: '' })
      fetchProduct()
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Review not submited'
      )
    }
  }

  if (loading) return <Loader />
  if (!product) return null

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '40px 24px',
    }}>

      {/* Product Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        marginBottom: '60px',
      }}>

        {/* Images */}
        <div>
          <img
            src={
              product.images?.[activeImg] ||
              'https://via.placeholder.com/500'
            }
            alt={product.name}
            style={{
              width: '100%',
              height: '420px',
              objectFit: 'cover',
              borderRadius: '16px',
              marginBottom: '12px',
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setActiveImg(i)}
                style={{
                  width: '70px',
                  height: '70px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: activeImg === i
                    ? '2px solid #111111'
                    : '2px solid transparent',
                }}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p style={{
            fontSize: '13px',
            color: '#718096',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            {product.category?.name}
          </p>

          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '16px',
            lineHeight: 1.3,
          }}>
            {product.name}
          </h1>

          <StarRating
            rating={product.rating}
            numReviews={product.numReviews}
          />

          <p style={{
            fontSize: '32px',
            fontWeight: '800',
            margin: '20px 0',
            color: '#111111',
          }}>
            ₹{product.price}
          </p>

          <p style={{
            fontSize: '14px',
            color: '#718096',
            lineHeight: 1.7,
            marginBottom: '24px',
          }}>
            {product.description}
          </p>

          <p style={{
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '16px',
            color: product.stock > 0 ? '#38a169' : '#e53e3e',
          }}>
            {product.stock > 0
              ? `✓ In Stock (${product.stock} is available)`
              : '✗ Out of Stock'}
          </p>

          {product.stock > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}>
              <label style={{ fontSize: '14px' }}>
                Quantity:
              </label>
              <select
                value={quantity}
                onChange={(e) =>
                  setQuantity(Number(e.target.value))
                }
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              >
                {Array.from(
                  { length: Math.min(product.stock, 10) },
                  (_, i) => i + 1
                ).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              padding: '14px 32px',
              background: product.stock === 0
                ? '#e2e8f0' : '#111111',
              color: product.stock === 0
                ? '#718096' : '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: product.stock === 0
                ? 'not-allowed' : 'pointer',
              width: '100%',
            }}
          >
            {product.stock === 0
              ? 'Out of Stock'
              : 'Add in Cart'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 style={{
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '24px',
          paddingBottom: '12px',
          borderBottom: '2px solid #e2e8f0',
        }}>
          Customer Reviews ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <p style={{ color: '#718096', marginBottom: '32px' }}>
            There is no Review now yet. give Review first.!
          </p>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '40px',
          }}>
            {reviews.map((review) => (
              <div
                key={review._id}
                style={{
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px',
                }}>
                  <strong style={{ fontSize: '15px' }}>
                    {review.user?.name}
                  </strong>
                  <StarRating rating={review.rating} />
                  <span style={{
                    fontSize: '12px',
                    color: '#718096',
                    marginLeft: 'auto',
                  }}>
                    {new Date(review.createdAt)
                      .toLocaleDateString('hi-IN')}
                  </span>
                </div>
                <p style={{
                  color: '#4a5568',
                  fontSize: '14px',
                  lineHeight: 1.6,
                }}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Review Form */}
        {isAuthenticated && (
          <div style={{
            padding: '28px',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            maxWidth: '500px',
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
            }}>
              Fill your Review
            </h3>

            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                }}>
                  Rating
                </label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      rating: Number(e.target.value),
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                >
                  <option value={5}>★★★★★ (5)</option>
                  <option value={4}>★★★★☆ (4)</option>
                  <option value={3}>★★★☆☆ (3)</option>
                  <option value={2}>★★☆☆☆ (2)</option>
                  <option value={1}>★☆☆☆☆ (1)</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                }}>
                  Comment
                </label>
                <textarea
                  rows={4}
                  placeholder="How did your experienced.?"
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      comment: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  background: '#111111',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Submit Review 
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  )
}

export default ProductDetail
