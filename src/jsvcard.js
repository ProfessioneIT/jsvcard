/*
 * @package jsvCard
 * @author Marco Cosentino
 * @copyright (C) 2011 www.professioneit.com
 * @license GNU/GPLv3 http://www.gnu.org/licenses/gpl-3.0.html
*/

/**
 * This module contains the jsvCard implementation: a vCard parser and
 * a form filler all made in HTML5 (HTML4 compatible) + jQuery. 
 * @module jsvCard
 * @requires jQuery, jsIconv
 */

/**
 * This is the main jsvCard object you should instantiate this 
 * only once in your web page.
 * @class jsvCard
 * @constructor
 */
var jsvCard = function(){
        
        var self = this;
        
        /**
         * This property sets the path to the freadstub, a stub used to read
         * the file without HTML5
         * @property freadstub
         */
        this.freadstub = "freadstub.php";
        
        this.chooseText = "Please choose the vCard file into the appropriate box.";
        this.dropText = "Alternatively you can drop your vCard file in the drop area below.";
        this.dropHereText = "Drop Here!";
        this.wrongInputText = "Please specify a vCard file in your filesystem.";
        this.wrongDropText = "Please drop only a valid file in the drop area.";
        this.errorReadingText = "An error occoured while reading your vCard file.";
        this.resetText = "Form Reset";
        
        this.forceHTML4 = true;
        
        /**
        * This function installs jsvcard on the specified form
        * and associate the popup to the click event of the clickable element
        * @method install
        */
        this.install = function(form_id,clickable_id,position_mode){
                
                // How many divs are already installed ?
                
                var installed = $("div.jsvcard").lenght !== undefined ? $("div.jsvcard").lenght : 0;
                var current_div = 'jsvcard' + installed;
                var current_div_canvas = 'jsvcardouter' + installed;
                var current_file = 'jsvcardfile' + installed;
                var current_url = 'jsvcardurl' + installed;
                var current_drop = 'jsvcarddrop' + installed;
                var current_reset = 'jsvcardreset' + installed;
                
                $('<div id="'+current_div_canvas+'" class="jsvcardouter"><div id="'+current_div+'" class="jsvcard"><p>'+this.chooseText+'</p></div></div>').hide().appendTo('body');
                
                $("#"+clickable_id).click(function(event){
                        $("#"+current_div_canvas).toggle();
                });
                
                // Position the div into the page
                // when the DOM is ready
                var calcpos_lambda = function(){
                        var pos = self.calculatePosition(
                                        $("#"+clickable_id).position(),
                                        {width:$("#"+clickable_id).width(), height:$("#"+clickable_id).height()},
                                        {width:336, height:376},
                                        position_mode);
                        $("#"+current_div_canvas).css({top:pos.top+"px",left:pos.left+"px"});			
                };
                $("#"+clickable_id).load(calcpos_lambda);
                $(document).ready(calcpos_lambda);
                $(window).resize(calcpos_lambda);

                $('<input type="file" id="'+current_file+'" name="'+current_file+'" single="single" size="15"/><br><br><input id="'+current_reset+'" type="button" value="'+this.resetText+'"/>').appendTo("#"+current_div);
                
                var params = {
                        html5:false,
                        form:form_id,
                        file:current_file,
                        url:current_url,
                        div_to_hide: current_div_canvas
                };
                
                // Install event handlers
                $('#'+current_reset).click(params,this.handleReset);

                // Check for the various File API support.
                if (window.File && window.FileReader && window.FileList && window.Blob && !this.forceHTML4) {
                        
                        // Using HTML5 File API	
                        params.html5 = true;
                        $('#'+current_file).change(params, this.handleLoad);
                        
                        // Determine if the drop event is supported
                        var dnd = "";
                        if(this.isEventSupported('dragstart') && this.isEventSupported('drop')){
                                
                                // Drag & drop supported
                                $("#"+current_div_canvas).addClass('dropok');
                                $("#"+current_div).addClass('dropok');
                                
                                dnd = '<p>'+this.dropText+'</p>'+'<div id="'+current_drop+'" class="jsvcarddrop">'+this.dropHereText+'</div>';
                                $(dnd).appendTo("#"+current_div);
                                
                                $('#'+current_drop).bind('dragover', this.handleDragOver);
                                $('#'+current_drop).bind('drop', params, this.handleDrop);
                        }
                        testdiv = null;
                } else {
                    //Using freadstub
                    $('#'+current_file).change(params, this.handleLoad);
                }
                
        };
        
        /**
         * This function is used to calculate the position of the popup
         * @method calculatePosition
         */
        this.calculatePosition = function(clpos,clsize,mysize,mode){
                var half_mysize = {width:mysize.width/2, height:mysize.height/2};
                var half_clsize = {width:clsize.width/2, height:clsize.height/2};
                var ret = {top:0, left:0};
                switch(mode){
                case "top":
                        ret.top = clpos.top - mysize.height;
                        ret.left = clpos.left + half_clsize.width - half_mysize.width;
                        break;
                case "top-left":
                        break;
                case "top-right":
                        break;
                case "bottom-right":
                        ret.top = clpos.top + clsize.height;
                        ret.left = clpos.left + clsize.width;
                        break;
                }
                return ret;
        };
        
        /**
        * Handles the normal file loading
        * @method handleLoad
        */
        this.handleLoad = function(evt){
                var files = document.getElementById(evt.data.file).files;
                
                if(evt.data.html5 && files !== undefined && files[0] !== undefined){
                    self.loadFromFile(files[0],evt.data.form);
                } else {
                    self.loadFromFileNoHTML5(evt.data.file,evt.data.form);
                }
                $('#'+evt.data.div_to_hide).hide();
                return true;
        };
        
        this.handleReset = function(evt){
                self.resetForm(evt.data.form);
                $('#'+evt.data.div_to_hide).hide();
        };
        
        this.handleDrop = function(evt){
            evt.stopPropagation();
            evt.preventDefault();
                
                var files = evt.originalEvent.dataTransfer.files; 
                
                // Take just the first file
                if(files[0]){
                        self.loadFromFile(files[0],evt.data.form);
                }
                else{
                        alert(self.wrongDropText);
                }
                $('#'+evt.data.div_to_hide).hide();
        };

        this.handleDragOver = function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
        };
        
        
    /*
    * Helpers
    */
    
    /*
    * Loads the vCard from a file using the File API (checked before calling)
    * file - a File object that represents the selected file to load
    * form - a String with the ID of the form to fill with data
    */
    this.loadFromFile = function(file,form){
        var reader = new FileReader();
        
        reader.onload = function(e) {
                self.parseAndFill(e.target.result,form);
        };
        reader.readAsBinaryString(file);
    };
    
    /*
    * Loads the vCard from a file using the freadstub method.
    * The existence of $.ajaxFileUpload must be checked before calling
    * file - a String with the ID of the input element
    * form - a String with the ID of the form to fill with data
    */
    this.loadFromFileNoHTML5 = function(file,form){
        
        // Create a hidden iframe that will receive the content of the submission
        var random = new Date().getTime();
        
        var src = window.ActiveXObject ? ' src="' + 'javascript:false' + '"' : "";
        
        var ifr_id = 'jsvcardiframe'+ random;
        var ifr = $('<iframe id="'+ifr_id+'" name="'+ifr_id+'"'+src+'></iframe>').hide().appendTo('body');
        
        var iform_id = 'jsvcardform'+ random;
        var iform = $('<form id="' + iform_id + '" name="' + iform_id + '" action="" method="post" target="" enctype="multipart/form-data"></form>').hide().appendTo('body');
        
        // Clone the file upload element and put the original one in the hidden form
        // The cloned one will replace the original
        var file_clone = $('#'+file).clone();
        $(file_clone).attr('id',"temp"+random);
        $(file_clone).insertBefore('#'+file);
        $('#'+file).appendTo(iform);
        $('<input type="hidden" name="element"/>').val(file).appendTo(iform);
        
        var requestDone = false;
        var timer = null;
        
        // Callback used to load the 
        var loadCallbackLambda = function(isTimeout){
            requestDone = true;
            if(timer){
                    clearTimeout(timer);
            }
            try{
                setTimeout( function(){
                        $(ifr).remove();
                        $(iform).remove();
                }, 100);
            } 
            catch(e){}
            
            if(isTimeout != "timeout"){
                self.freadstubPutDone(form);
            }
            else{
                alert(self.errorReadingText + "\nRequest timeout!");
            }
            // Here we restore the id for the input
                $('#'+"temp"+random).attr('id',file);
        };
        
        $(ifr).load(loadCallbackLambda);
        
        $(iform).attr('action', self.freadstub);
        $(iform).attr('method', 'post');
        $(iform).attr('target', ifr_id);
        if(iform.encoding){
            iform.encoding = 'multipart/form-data';
        }
        else{
                iform.enctype = 'multipart/form-data';
        }
        
        try{
            $(iform).submit();
            timer = setTimeout(function(){
                // Check to see if the request is still happening
                if( !requestDone ) {
                    loadCallbackLambda( "timeout" );
                }
            }, 10000); // 10 secs.
        } 
        catch(e){
                alert(self.errorReadingText + "\n" + e);
        }
    };
    
    this.freadstubPutDone = function(form){
        $.ajax({
                url: self.freadstub,
                data: {action: 'get'},
                success: function(data) {
                        self.parseAndFill(data,form);
                },
                statusCode:{
                        599: function(){
                                alert(self.errorReadingText + "\nFreadstub reported: Missing content!");
                        },
                        500: function(){
                                alert(self.errorReadingText + "\nFreadstub reported: Generic error!");
                        }
                }
        });
    };
    

    this.parseAndFill = function(data,formid){
        var vcard = new vCard(); 
        var vcdata = vcard.parsevCardData(data);
        self.fillForm('vTargetForm',vcdata);
    };
    
    /*
    * Fills the specified form with vCard parsed data.
    * If you don't like the class names we use you can override this
    * function with your own.
    * formid - a String with the ID of the form to fill with data
    * vcard - an Object that holds the data
    */
        this.fillForm = function(formid,vcard)
        {
                $('form#'+formid+' .vVersion').val( vcard.version );
                $('form#'+formid+' .vTitle').val( vcard.title );
                
                $('form#'+formid+' .vFirstName').val( vcard.n.first );
                $('form#'+formid+' .vMidNames').val( vcard.n.middle );
                $('form#'+formid+' .vLastName').val( vcard.n.last );
                $('form#'+formid+' .vNamePrefix').val( vcard.n.prefix );
                $('form#'+formid+' .vNamePostfix').val( vcard.n.postfix );
                
                $('form#'+formid+' .vFName').val( vcard.fn );
                $('form#'+formid+' .vBirthDate').val( vcard.bday );
                
                if(vcard.adr !== undefined){
                        if(vcard.adr.home !== undefined){
                                $('form#'+formid+' .vAddressHomePO').val( vcard.adr.home.po );
                                $('form#'+formid+' .vAddressHomeExt').val( vcard.adr.home.extension );
                                $('form#'+formid+' .vAddressHomeStreet').val( vcard.adr.home.street );
                                $('form#'+formid+' .vAddressHomeLocality').val( vcard.adr.home.location );
                                $('form#'+formid+' .vAddressHomeRegion').val( vcard.adr.home.region );
                                $('form#'+formid+' .vAddressHomePostalCode').val( vcard.adr.home.postalcode );
                                $('form#'+formid+' .vAddressHomeCountry').val( vcard.adr.home.country );
                        }
                }
                
                if(vcard.label !== undefined) {
                        $('form#'+formid+' .vAddressHomeLabel').val( vcard.label.home );
                        $('form#'+formid+' .vAddressHomeLabel').html( vcard.label.home );
                }
                
                if(vcard.tel !== undefined) {
                        if(vcard.tel.home !== undefined) {
                                $('form#'+formid+' .vTelHomeVoice').val( vcard.tel.home.voice );
                                $('form#'+formid+' .vTelHomeFax').val( vcard.tel.home.fax );
                        }
                
                        if(vcard.tel.work !== undefined) {
                                $('form#'+formid+' .vTelWorkVoice').val( vcard.tel.work.voice );
                                $('form#'+formid+' .vTelWorkFax').val( vcard.tel.work.fax );
                        }
                }
        };
        
        this.resetForm = function(formid){
                alert("TODO: RESET");
                $('form#'+formid+' input').val('');
                $('form#'+formid+' textarea').html('');
        };
                        
		/**
		* Determines if a given element supports the given event
		* function from http://yura.thinkweb2.com/isEventSupported/
		* @method isEventSupported
		*/
        this.isEventSupported = function ( eventName, element ) {

            var TAGNAMES = {
                        'select': 'input', 'change': 'input',
                        'submit': 'form', 'reset': 'form',
                        'error': 'img', 'load': 'img', 'abort': 'img'
                    };

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = eventName in element;

        if ( !isSupported ) {
	        // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
	        if ( !element.setAttribute ) {
	            element = document.createElement('div');
	        }
	        if ( element.setAttribute && element.removeAttribute ) {
	            element.setAttribute(eventName, '');
	            isSupported = is(element[eventName], 'function');
	
	            // If property was created, "remove it" (by setting value to `undefined`)
	            if ( !is(element[eventName], 'undefined') ) { element[eventName] = undefined; }
	            element.removeAttribute(eventName);
	        }
        }

        element = null;
        return isSupported;
    };
    
};

