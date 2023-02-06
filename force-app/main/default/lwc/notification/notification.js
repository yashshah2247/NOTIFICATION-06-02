    import { LightningElement,api,track } from 'lwc';
    // import Notification_obj from '@salesforce/schema/Notification__c';
    // import toadd from '@salesforce/schema/Notification__c.To_Recipients__c';
    // import ccadd from '@salesforce/schema/Notification__c.	CC_Recipients__c';
    // // import replyto from '@salesforce/schema/Notification__c.To_Recipients__c';
    // import subject from '@salesforce/schema/Notification__c.Subject__c';
    // import message from '@salesforce/schema/Notification__c.Attachment__c';
    // import attachment from '@salesforce/schema/Notification__c.To_Recipients__c';
    // import create from '@salesforce/apex/notificationInsertData.createNotification';
    import getContactList from '@salesforce/apex/notificationInsertData.getContactList';
    import create from '@salesforce/apex/notificationInsertData.create';
    import updated from '@salesforce/apex/notificationInsertData.updated';
    //import add from '@salesforce/resourceUrl/Puls_icon';

    export default class NotificationComponent extends LightningElement {
        @track Notification__c;
        @track Notification_list=[];
        @track error;
        @track required_to = false;
        @track required_Subject = false;
        @track required_Message = false;
        @track toAddress ='';
        @track ccAddress;
        @track Subject= '';
        @track Message= '';
        @track Attachment;
        @track toast_error_msg;
        @api form_id = 'a046D000004x9wPQAq';
        @track Notification_id;
        @track list_length;
        @track to;
        @track cc;
        @track to_list = [];
        @track cc_list = [];
    
        connectedCallback(){
            this.Cancel();
        }

        
        handleToAddressChange(event) {
            console.log('in to add');
            console.log({event});
            this.required_to = false;

            this.toAddress = event.detail.selectedValues;
            // alert(this.toAddress);
            console.log('this.toAddress>>>',this.toAddress);
            // alert(this.toAddress);
        }

        handleCcAddressChange(event) {
            console.log({event});
            // console.log('in to cc');
            this.ccAddress = event.detail.selectedValues;
            console.log('this.ccAddress>>>',this.ccAddress);
            // alert(this.ccAddress);
            console.log(this.ccAddress);
        }
        // handleReplyTo(event) {
        //     this.replyto = event.target.value;
        //     console.log(this.replyto);
        // }
        handleSubject(event) {

            console.log('in to sub');
            this.Subject = event.target.value;
            this.required_Subject = false;
            console.log('che subject :- ',this.Subject);
        }
        handlemessage(event) {
            // console.log('in to mes ');
            this.required_Message = false;
            this.Message = event.target.value;
            console.log('che mes :- ',this.Message);
        }
        handleAttachment(event) {
            console.log('in to attachent'+event);
            this.Attachment = event.target.checked;
            console.log('yas :- '+this.Attachment);
        }
        save(){
            console.log('you r in save');
            let text = this.toAddress.toString();
            let text2 = this.ccAddress.toString();
            if(text == ''){
                // alert('pls insert to');
                this.required_to = true;
            }
            if(this.Subject==''){
                this.required_Subject = true;
                // alert('pls insert subject');
            }
            if(this.Message==''){
                this.required_Message = true;
                // alert('pls insert mes');

            }
            
            if(text != '' &&this.Subject!='' &&this.Message!=''){
                console.log('you r in req');
                let listObj = { 'sobjectType': 'Notification__c' };
                    listObj.To_Recipients__c = text;
                    listObj.CC_Recipients__c = text2;
                    listObj.Subject__c = this.Subject;
                    listObj.Email_Body__c = this.Message;
                    listObj.Form__c = this.form_id;
                    listObj.Attachment__c = this.Attachment;
                    listObj.Id = this.Notification_id;
                // console.log('test '+ listObj);
                if(this.Notification_id == null){
                    console.log('you r in insert');
                    create({ acc : listObj })
                    .then(data =>{
                        console.log({data});
                        console.log();
                        this.toast_error_msg = 'Successfully Saved';
                        this.template.querySelector('c-toast-component').showToast('success',this.toast_error_msg,3000);
                    })
                    .catch(error => {
                        console.log({error});
                    })
                }
                else{
                    console.log('you r in update');
                    updated({ updatelist : listObj})
                    .then(data =>{
                        console.log({data});
                        console.log();
                        this.toast_error_msg = 'Successfully Update';
                        this.template.querySelector('c-toast-component').showToast('success',this.toast_error_msg,3000);
                    })
                    .catch(error => {
                        console.log({error});
                    })
                }
            }
        }
        Cancel(){
            getContactList({form_id :this.form_id})

            .then(result => {
                this.list_length = result.length;
                // console.log('len',result.length);
                // console.log('test result',result);
                // console.log('t0',result[0].Subject__c);
                this.to = result[0].To_Recipients__c;
                // window.console.log("test", this.to.split(','));
                this.to_list = this.to.split(',');
                console.log('to',this.to_list[1]);
                this.to_list = this.to;
                this.template.querySelector('c-email-input').to_email(this.to);
                this.cc = result[0].CC_Recipients__c;
                this.cc_list = this.cc;
                console.log('cc',this.cc);
                this.template.querySelector('c-email-input-c-c').to_email(this.cc);
                this.Subject = result[0].Subject__c;
                this.Message = result[0].Email_Body__c;
                this.Attachment = result[0].Attachment__c;
                this.Notification_id = result[0].Id;
                console.log('noti',this.Notification_id);
            })
            .catch(error => {
                this.error = error;
            });
            // console.log('yash',this.Notification__c.To_Recipients__c);
            // alert('test',this.Notification__c);
            if(this.list_length <1){
                console.log('hey you are in if');
                this.toAddress ='';
                this.ccAddress ='';
                this.Subject = '';
                this.Message = '';
                this.Attachment = false;

            }

            this.toAddress ='';
            this.ccAddress ='';
            this.form_id;
        }
        

        

    }