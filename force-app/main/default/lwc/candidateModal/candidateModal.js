import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getUserInfo from '@salesforce/apex/CandidateModalController.getUserInfo';
import getCandidates from '@salesforce/apex/CandidateModalController.getCandidates';

export default class CandidateModal extends LightningElement {
    isModalOpen = false;
    currentScreen = 1;
    userLastName = '';
    candidates = [];
    selectedCandidateId = null;
    selectedRows = [];

    columns = [
        { label: 'First Name', fieldName: 'First_Name__c', type: 'text' },
        { label: 'Last Name', fieldName: 'Last_Name__c', type: 'text' },
        { label: 'Phone', fieldName: 'Phone__c', type: 'phone' },
        { label: 'Email', fieldName: 'Email__c', type: 'email' }
    ];

    get isScreen1() {
        return this.currentScreen === 1;
    }

    get isScreen2() {
        return this.currentScreen === 2;
    }

    get isScreen3() {
        return this.currentScreen === 3;
    }

    get isPreviousDisabled() {
        return this.currentScreen === 1;
    }

    get isNextDisabled() {
        if (this.currentScreen === 2 && !this.selectedCandidateId) {
            return true;
        }
        return this.currentScreen === 3;
    }

    get hasCandidates() {
        return this.candidates && this.candidates.length > 0;
    }

    get showNavigationButtons() {
        return this.currentScreen !== 3;
    }

    openModal() {
        this.isModalOpen = true;
        this.currentScreen = 1;
        this.loadUserInfo();
    }

    closeModal() {
        this.isModalOpen = false;
        this.currentScreen = 1;
        this.selectedCandidateId = null;
        this.selectedRows = [];
    }

    loadUserInfo() {
        getUserInfo()
            .then(result => {
                this.userLastName = result.LastName;
            })
            .catch(error => {
                this.showToast('Error', 'Error loading user information', 'error');
                console.error(error);
            });
    }

    loadCandidates() {
        getCandidates()
            .then(result => {
                this.candidates = result;
            })
            .catch(error => {
                this.showToast('Error', 'Error loading candidates', 'error');
                console.error(error);
            });
    }

    handleNext() {
        if (this.currentScreen === 1) {
            this.currentScreen = 2;
            this.loadCandidates();
        } else if (this.currentScreen === 2 && this.selectedCandidateId) {
            this.currentScreen = 3;
        }
    }

    handlePrevious() {
        if (this.currentScreen > 1) {
            this.currentScreen--;
            if (this.currentScreen === 2) {
                this.selectedCandidateId = null;
            }
        }
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        if (selectedRows.length > 0) {
            this.selectedCandidateId = selectedRows[0].Id;
        } else {
            this.selectedCandidateId = null;
        }
    }

    handleSubmit(event) {
        // Optional: Add any pre-submit logic here
    }

    handleSuccess(event) {
        this.showToast('Success', 'Candidate updated successfully', 'success');
        this.closeModal();
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}