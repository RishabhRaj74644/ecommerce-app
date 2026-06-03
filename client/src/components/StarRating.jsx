const StarRating = ({ rating, numReviews }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: '16px',
            color: star <= Math.round(rating)
              ? '#f6ad55'
              : '#e2e8f0',
          }}
        >
          ★
        </span>
      ))}
      {numReviews !== undefined && (
        <span style={{
          fontSize: '13px',
          color: '#718096',
          marginLeft: '4px',
        }}>
          ({numReviews})
        </span>
      )}
    </div>
  )
}

export default StarRating