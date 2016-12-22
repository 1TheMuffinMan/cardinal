import React, { PropTypes } from 'react'
import Modal from 'react-modal'

export default function NewDeckModal (props) {
  const { isOpen, isSaving, name, error } = props

  return (
    <Modal isOpen={isOpen} contentLabel={'Create New Deck'}>
      <div>{`isSaving: ${isSaving}`}</div>
      <div>{`Name: ${name}`}</div>
      <div>{`Error: ${error}`}</div>
    </Modal>
  )
}

NewDeckModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
}