import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axios.js'
import Loader from '../../components/Loader.jsx'

const ManageProducts = () => {
  const [products, setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]     = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm]   = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  })

const [images, setImages] = useState([])
const [previews, setPreviews] = useState([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?limit=100'),
        api.get('/categories'),
      ])
      setProducts(prodRes.data.products)
      setCategories(catRes.data.categories)
    } catch {
      toast.error('Data not loaded')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
    })
    setImages([])        
    setPreviews([])
    setEditingId(null)
    setShowForm(false)
  }

  const handleImageChange = (e) => {
  const files = Array.from(e.target.files)

  setImages(files)

  // Preview ke liye URLs banao
  const previewUrls = files.map((file) =>
    URL.createObjectURL(file)
  )
  setPreviews(previewUrls)
}

  const handleEdit = (product) => {
    setForm({
      name:        product.name,
      description: product.description,
      price:       product.price,
      stock:       product.stock,
      category:    product.category?._id || '',
      images:      product.images || [],
    })
    setEditingId(product._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (!form.name || !form.price ||
      !form.stock || !form.category) {
    toast.error('Fill out the all fields')
    return
  }

  try {
    // FormData  — with image 
    const formData = new FormData()
    formData.append('name',        form.name)
    formData.append('description', form.description)
    formData.append('price',       form.price)
    formData.append('stock',       form.stock)
    formData.append('category',    form.category)

    // Images add karo
    images.forEach((image) => {
      formData.append('images', image)
    })

    if (editingId) {
      await api.put(`/products/${editingId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Product updated!')
    } else {
      await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Product created!')
    }

    resetForm()
    fetchData()
  } catch (err) {
    toast.error(
      err.response?.data?.message || 'Error happend'
    )
  }
}

  const handleDelete = async (id) => {
    if (!window.confirm(
      'Are you sure you want to delete this product?'
    )) return

    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted!')
      fetchData()
    } catch {
      toast.error('Not Deleted')
    }
  }

  if (loading) return <Loader />

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '40px 24px',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
      }}>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '700',
        }}>
          Manage Products
        </h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          style={{
            padding: '10px 20px',
            background: showForm ? '#718096' : '#111111',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          padding: '28px',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          marginBottom: '32px',
          background: '#f7fafc',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '20px',
          }}>
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}>
              <div>
                <label style={labelStyle}>Product Name</label>
                <input
                  placeholder="Product name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  style={inputStyle}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Price (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Stock</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Product description..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                  }}
                  required
                />
              </div>

              {/* Image Upload Field */}
              <div style={{ gridColumn: '1 / -1' }}>
               <label style={labelStyle}>
                Product Images
               </label>

               <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px dashed #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              />

              <p style={{
                fontSize: '12px',
                color: '#718096',
                marginTop: '4px',
              }}>
                Max 5 images, 2MB each (JPG, PNG, WebP)
              </p>

  {/* Image Previews */}
              {previews.length > 0 && (
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '12px',
                  flexWrap: 'wrap',
                }}>
                  {previews.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    />
                  ))}
                </div>
              )}

  {/* Existing Images — Edit Mode */}
              {editingId && form.images?.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#718096',
                    marginBottom: '8px',
                  }}>
                    Current images:
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                  }}>
                    {form.images.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Current ${index + 1}`}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          opacity: 0.7,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              </div>

      
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '20px',
            }}>
              <button
                type="submit"
                style={{
                  padding: '11px 24px',
                  background: '#111111',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '11px 24px',
                  background: '#ffffff',
                  color: '#718096',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
        }}>
          <thead>
            <tr style={{ background: '#f7fafc' }}>
              {['Product', 'Category', 'Price',
                'Stock', 'Rating', 'Actions'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#4a5568',
                    borderBottom: '2px solid #e2e8f0',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                style={{
                  borderBottom: '1px solid #f7fafc',
                }}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                    <img
                      src={
                        product.images?.[0] ||
                        'https://via.placeholder.com/50'
                      }
                      alt={product.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{
                      fontWeight: '500',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {product.name}
                    </span>
                  </div>
                </td>
                <td style={{
                  padding: '14px 16px',
                  color: '#718096',
                }}>
                  {product.category?.name || 'N/A'}
                </td>
                <td style={{
                  padding: '14px 16px',
                  fontWeight: '600',
                }}>
                  ₹{product.price}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: product.stock === 0
                      ? '#fee2e2'
                      : product.stock < 5
                      ? '#fef3c7'
                      : '#dcfce7',
                    color: product.stock === 0
                      ? '#dc2626'
                      : product.stock < 5
                      ? '#d97706'
                      : '#16a34a',
                  }}>
                    {product.stock === 0
                      ? 'Out of Stock'
                      : `${product.stock} left`}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  ⭐ {product.rating} ({product.numReviews})
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                  }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{
                        padding: '6px 14px',
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      style={{
                        padding: '6px 14px',
                        background: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p style={{
            textAlign: 'center',
            padding: '40px',
            color: '#718096',
          }}>
            No products found. Add one!
          </p>
        )}
      </div>

    </div>
  )
}

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '13px',
  fontWeight: '500',
  color: '#4a5568',
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  background: '#ffffff',
}

export default ManageProducts