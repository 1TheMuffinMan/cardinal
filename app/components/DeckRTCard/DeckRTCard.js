import React, { PropTypes } from 'react'
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'
import { Button } from 'react-toolbox/lib/button'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import Delay from 'react-delay'

export default function DeckRTCard({
    deckId,
    isDeleting,
    name,
    description,
    cardCount,
    onReview,
    onView,
    onEdit,
    onDelete,
  }) {
  return (
    <Card style={{ width: '350px', margin: '0.9rem' }}>
      <CardTitle title={name} subtitle={`${cardCount} ${cardCount === 1 ? 'card' : 'cards'}`} />
      <CardText>
        <span>{description}</span>
        {
          // If save completes quickly, we don't want to briefly flash the progress bar. So we
          // wait briefly before showing it.
          isDeleting === true ? (
              <Delay wait={1000}>
                <div style={{margin: '1.8rem 0 0 0'}}>
                  <ProgressBar type='linear' mode='indeterminate' />
                </div>
              </Delay>
            ) :
            null
        }
      </CardText>
      <CardActions>
        <Button label={'Review'} onClick={onReview}/>
        <Button label={'View'} onClick={onView}/>
        <Button label={'Edit'} onClick={onEdit} />
        <Button label={'Delete'} onClick={onDelete} />
      </CardActions>
    </Card>
  )
}

DeckRTCard.propTypes = {
  deckId: PropTypes.string.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cardCount: PropTypes.number.isRequired,
  onReview: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}