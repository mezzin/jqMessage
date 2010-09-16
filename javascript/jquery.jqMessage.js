/*
 * jqMessage plugin
 * Copyright (c) 2010 Justin Kieft
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($) {    
    var TRUE      = true,
        FALSE     = false,
        NULL      = null,
        window    = self,
        undefined = undefined;
    
    $.fn.extend({
        // Make any element a message element by adding type (success,error,loading) and message it will generate a nice message block
        // There is a short code for error message $().jqMessage("error",JSON.errors)
        jqMessage : function(type,message,options){
            var defaults = {
		prefix:"",
		form:"",
		scrollTo:FALSE,
		scrollToSpeed: 400
	    };
            var opts = $.extend(defaults,options);
            $(".all_input_error").removeClass("all_input_error");
            return this.each(function() {
		$(this).hide();
                $(this).removeClass().html("");
		if(type.toLowerCase() != 'clear'){
                    $(this).removeClass().addClass("all_message_block all_"+type+"_message_block").html("<div class=\"all_message_header all_"+type+"_message_header\"><span class=\"all_message_text\"></span></div>").show();
                    if(typeof message == "string"){
                        $(this).find("span.all_message_text").html(message);
                    }
                    if(type.toLowerCase() == 'error'){
                        if(typeof message != "string"){
                            opts.errors = message;
                            message = opts.errors.error
                        }
                        $(this).find("span.all_message_text").html(message);
                        if(typeof opts.errors != 'undefined'){
                            $(this).append($("<ul class=\"all_error_list\"></ul>"));
                            for (var key in opts.errors) {
                                if(key!="error"){
                                    if(opts.prefix==""){
                                        if (typeof opts.form == "string" && opts.form!=""){
                                            $("#"+opts.form).find("input[name="+key+"]").addClass("all_input_error");
                                        } else {
                                            if($("input[name="+key+"]").addClass("all_input_error").length==0){
                                                $("textarea[name="+key+"]").addClass("all_input_error");
                                            }
                                            if($("input[name="+key+"]").attr("type") == "file"){
                                                $("input[name="+key+"]").parent().find("div.fakefile").find("input").addClass("all_input_error");
                                            }
                                        }                               
                                    } else {
                                        $("#"+opts.prefix+"_"+key).addClass("all_input_error");
                                    }
                                    if(opts.errors[key]!="") {
                                        $(this).find("ul.all_error_list").append($("<li>"+opts.errors[key]+"</li>"));
                                    }
                                }
                            }
                        }
                    }
                }
                $(this).show();	
		if(type.toLowerCase() != 'loading') {
                    if ($.scrollTo && opts.scrollTo) {
                        $.scrollTo(this,opts.scrollToSpeed);
                    }
                }			
            });
        },

        jqmAjaxForm : function(wcId,jqmMessageContainer,options){
            if ($().ajaxForm) {
                var defaults = {
                    loadingMessage: "Uw gegevens worden opgeslagen.",
                    hideForm: TRUE,
                    redirect: TRUE,
                    jqMessage: {},
                    success: function(JSONResponse){},
                    error: function(JSONResponse){},
                    jqmMessageContainer: {},
                    jersForm: {},
                    ajaxFormOptions: {}
                };
                var opts = $.extend({},defaults, options);
                opts.jqmMessageContainer = jqmMessageContainer;
                opts.jersForm = this;
                var postUrl;
                if (typeof wcId == "string") {
                    postUrl = wcId;
                }
                else {
                    postUrl = "/controller/WebController/?wcId=" + wcId;
                }
                var ajaxFormDefaults = {
                    url: postUrl,
                    jqmAjaxFormOpts: opts,
                    dataType: "json",
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    beforeSubmit: function(){
                        this.jqmAjaxFormOpts.jqmMessageContainer.jqMessage("loading", this.jqmAjaxFormOpts.loadingMessage,this.jqmAjaxFormOpts.jqMessage);
                    },
                    success: function(JSON){
                        if (JSON.errors.error || (JSON.errors[0] && JSON.errors[0].error)) {
                            this.jqmAjaxFormOpts.jqmMessageContainer.jqMessage("error", (JSON.errors.error) ? JSON.errors : JSON.errors[0],this.jqmAjaxFormOpts.jqMessage);
                            this.jqmAjaxFormOpts.error(JSON);
                        }
                        else {
                            this.jqmAjaxFormOpts.jqmMessageContainer.jqMessage("success", JSON.data.message,this.jqmAjaxFormOpts.jqMessage);
                            if (this.jqmAjaxFormOpts.hideForm) {
                                opts.jersForm.hide();
                            }
                            if (this.jqmAjaxFormOpts.redirect && JSON.data.redirectUrl) {
                                document.location = JSON.data.redirectUrl;
                            }
                            this.jqmAjaxFormOpts.success(JSON);
                        }
                    }
                };
                var ajaxFormOpts = $.extend({},ajaxFormDefaults, opts.ajaxFormOptions);
                return $(this).ajaxForm(ajaxFormOpts);
            } else {
                throw "jquery.form.js is not loaded.";          
            }
        }
    });
})(jQuery);
