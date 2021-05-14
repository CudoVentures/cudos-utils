import React, { Component } from 'react';
import i18n from 'meteor/universe:i18n';
import { Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap';
import { TRANSACTION_STATUS_DONE_ERROR, TRANSACTION_STATUS_DONE_OK, TRANSACTION_STATUS_PENDING, TRANSACTION_STATUS_DONE_ERROR_WRONG_CAPTCHA } from './FaucetUtils';

const T = i18n.createComponent();

export default class FaucetModal extends Component {

    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal isOpen={ this.props.isOpen } >
                <ModalHeader>
                    { this.props.transactionStatus === TRANSACTION_STATUS_PENDING && (
                        <T>faucet.modalMsgTransactionPending</T>
                    ) }
                    { this.props.transactionStatus === TRANSACTION_STATUS_DONE_OK && (
                        <span className="text-success">{i18n.__('faucet.modalMsgTransactionSuccess').replace('%s', Meteor.settings.public.coins[0].displayName)}</span>
                    ) }
                    { this.props.transactionStatus === TRANSACTION_STATUS_DONE_ERROR && (
                        <span className="text-danger"><T>faucet.modalMsgTransactionError</T></span>
                    ) }
                    { this.props.transactionStatus === TRANSACTION_STATUS_DONE_ERROR_WRONG_CAPTCHA && (
                        <span className="text-danger"><T>faucet.modalMsgCaptchaError</T></span>
                    ) }
                </ModalHeader>
                { this.props.transactionStatus === TRANSACTION_STATUS_PENDING && (
                    <ModalBody>
                        <Spinner type="grow" color="primary" />
                    </ModalBody>
                ) }
                { this.props.transactionStatus !== TRANSACTION_STATUS_PENDING && (
                    <>
                        <ModalFooter>
                            <button type="button" className="btn btn-primary d-flex align-items-center" onClick={ this.props.handleClose }><T>faucet.modalClose</T></button>
                        </ModalFooter>
                    </>
                ) }
            </Modal>
        )
    }

}