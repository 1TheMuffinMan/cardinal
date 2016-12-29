import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { EditDeckDialog } from 'components'
import * as newDeckDialogActionCreators from 'redux/modules/newDeckDialog'

function mapStateToProps ({newDeckDialog}, ownProps) {
  return {
    isActive: newDeckDialog.get('isActive'),
    isSaving: newDeckDialog.get('isSaving'),
    title: 'Create New Deck',
    name: newDeckDialog.get('name'),
    description: newDeckDialog.get('description'),
    isSnackbarActive: newDeckDialog.getIn(['snackbar', 'isActive']),
    snackbarError: newDeckDialog.getIn(['snackbar', 'error'])
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return bindActionCreators(newDeckDialogActionCreators, dispatch)
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...ownProps,
    onNameChange: dispatchProps.updateNewDeckName,
    onDescriptionChange: dispatchProps.updateNewDeckDescription,
    onSave: dispatchProps.saveAndHandleNewDeck,
    onCancel: dispatchProps.closeNewDeckDialog,
    onDismissSnackbar: dispatchProps.dismissNewDeckSnackbar,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(EditDeckDialog)