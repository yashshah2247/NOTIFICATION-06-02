import { LightningElement, track, api } from "lwc";
import { loadStyle } from 'lightning/platformResourceLoader';
import notification_css from '@salesforce/resourceUrl/notification_css';
import search from "@salesforce/apex/EmailClass.search";
export default class EmailInput extends LightningElement {
    @track email_msg = false;
    @track items = [];
    @track getprogreshbar;
    @track to_list;
    _selectedValues = [];
    selectedValuesMap = new Map();
    renderedCallback(){
        Promise.all([
            loadStyle( this, notification_css )
            ]).then(() => {
                // console.log( 'icon' );
            })
            .catch(error => {
                // console.log( error.body.message );
        });
    }
    get selectedValues() {
        return this._selectedValues;
    }
    set selectedValues(value) {
        this._selectedValues = value;
        const selectedValuesEvent = new CustomEvent("selection", { detail: { selectedValues: this._selectedValues} });
        this.dispatchEvent(selectedValuesEvent);
    }
    handleKeyPress(event) {
        if (event.keyCode === 13) {
            event.preventDefault(); // Ensure it is only this code that runs
            const value = this.template.querySelector('lightning-input.input2').value;
            var pattern =/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var validation = pattern.test(value);

            if (validation == false) {
            this.email_msg = true;
            }
            else{
                this.email_msg = false;
                this.selectedValuesMap.set(value, value);
                this.selectedValues = [...this.selectedValuesMap.keys()];
            }
            this.template.querySelector('lightning-input.input2').value = "";
        }
    }
    handleRemove(event) {
        const item = event.target.label;
        this.selectedValuesMap.delete(item);
        this.selectedValues = [...this.selectedValuesMap.keys()];
    }

    @api reset() {
        this.selectedValuesMap = new Map();
        this.selectedValues = [];
    }

    @api validate() {
        this.template.querySelector('input').reportValidity();
        const isValid = this.template.querySelector('input').checkValidity();
        return isValid;
    }
    @api to_email(strTO){
        this.getprogreshbar = strTO;
        // console.log('this.getprogreshbar>>',this.getprogreshbar);
        this.to_list = this.getprogreshbar.split(',');
            // console.log('to',this.to_list[1]);
            for(var i=0; i<this.to_list.length; i++){
                const value = this.to_list[i];
                // console.log('to :-',value);
                this.selectedValuesMap.set(value, value);
                this.selectedValues = [...this.selectedValuesMap.keys()];
                // this.selectedValues=value;
            }
    }
}