import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import ProductCard from '../components/ProductCard.jsx'
import Loader from '../components/Loader.jsx'

const Home = () => {
  const navigate = useNavigate()

  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories]             = useState([])
  const [loading, setLoading]                   = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products?sort=-rating&limit=8'),
          api.get('/categories'),
        ])

        setFeaturedProducts(productsRes.data.products)
        setCategories(categoriesRes.data.categories)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
        color: '#ffffff',
        padding: '80px 32px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '14px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: '#a0aec0',
          marginBottom: '16px',
        }}>
          Welcome to ShopApp
        </p>

        <h1 style={{
          fontSize: '52px',
          fontWeight: '800',
          marginBottom: '20px',
          lineHeight: 1.2,
        }}>
          Shop Everything
          <br />
          <span style={{ color: '#f6ad55' }}>
            You Love
          </span>
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#a0aec0',
          marginBottom: '40px',
          maxWidth: '500px',
          margin: '0 auto 40px',
          lineHeight: 1.6,
        }}>
          Discover quality products at amazing prices.
          Fast delivery, easy returns.
        </p>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => navigate('/products')}
            style={{
              padding: '15px 36px',
              background: '#f6ad55',
              color: '#111111',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Shop Now →
          </button>

          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '15px 36px',
              background: 'transparent',
              color: '#ffffff',
              border: '2px solid #ffffff',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Stats Banner */}
      <div style={{
        background: '#f7fafc',
        padding: '32px',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          textAlign: 'center',
        }}>
          {[
            { number: '1000+', label: 'Products' },
            { number: '500+', label: 'Happy Customers' },
            { number: 'Free', label: 'Shipping ₹500+' },
            { number: '24/7', label: 'Support' },
          ].map((stat) => (
            <div key={stat.label}>
              <p style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#111111',
                marginBottom: '4px',
              }}>
                {stat.number}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#718096',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '60px 24px',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '8px',
            }}>
              Shop by Category
            </h2>
            <p style={{
              color: '#718096',
              fontSize: '16px',
            }}>
              Find what you're looking for
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '16px',
          }}>
            {categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() =>
                  navigate(`/products?category=${cat._id}`)
                }
                style={{
                  padding: '24px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: '#ffffff',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#111111'
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.transform =
                    'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff'
                  e.currentTarget.style.color = '#111111'
                  e.currentTarget.style.transform =
                    'translateY(0)'
                }}
              >
                <div style={{
                  fontSize: '32px',
                  marginBottom: '10px',
                }}>
                  🛍️
                </div>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  {cat.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 24px 60px',
      }}>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '8px',
            }}>
              Top Rated Products
            </h2>
            <p style={{ color: '#718096', fontSize: '16px' }}>
              Our customers' favourites
            </p>
          </div>
          <Link
            to="/products"
            style={{
              padding: '10px 20px',
              border: '2px solid #111111',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#111111',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : featuredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: '#718096',
          }}>
            <p style={{ fontSize: '18px' }}>
              No products yet.
            </p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Add products from Admin panel!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Banner */}
      <div style={{
        background: '#111111',
        color: '#ffffff',
        padding: '60px 32px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '12px',
        }}>
          Ready to Start Shopping?
        </h2>
        <p style={{
          color: '#a0aec0',
          marginBottom: '28px',
          fontSize: '16px',
        }}>
          Join thousands of happy customers today.
        </p>
        <button
          onClick={() => navigate('/products')}
          style={{
            padding: '14px 36px',
            background: '#f6ad55',
            color: '#111111',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          Browse Products →
        </button>
      </div>

    </div>
  )
}

export default Home