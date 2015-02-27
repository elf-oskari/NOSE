/**
* This is used to validate symbolizer params in SLD editor view. 
*
*/
define([
  'lodash',
  'jquery',
  'i18n!localization/nls/validation'
], function(_, $, localeValidation) {
	return {

		validateParam: function (element, param_name, newvalue) {
	      // validateResult is an array [valid/invalid, errormessage]
	      var validateResult;
	      if (element.type === "number") {
	          validateResult = this.validateNumber(newvalue, param_name);
	      } else if (element.type === "color") {
	        validateResult = this.validateColor(newvalue);
	      } else if (element.type === "url") {
	        validateResult = this.validateUrl(newvalue);
	      } else if (element.type === "select-one") {
	        if (param_name === "stroke-linecap") {
	          validateResult = this.validateLinecap(newValue);
	        } else if (param_name === "graphic-symbol") {
	          validateResult = this.validateGraphicsymbol(newvalue);
	        } else if (param_name === "stroke-linejoin") {
	          validateResult = this.validateLinejoin(newvalue);
	        } else if (param_name === "font-family") {
	          validateResult = this.validateFontFamily(newvalue);
	        } else if (param_name === "font-style") {
	          validateResult = this.validateFontStyle(newvalue);
	        } else if (param_name === "font-weight") {
	          validateResult = this.validateFontWeight(newvalue);
	        }
	      }
	      return validateResult;
	    },
		handleInvalidParam: function (validation, element) {
	      var self = this;
	      if ($(element).hasClass("invalid")) {
	      	$(".invalid-value-error").attr('data-original-title', validation[1]);
	      	return;
	      }
	      $(element).addClass("invalid");
	      $(element.parentElement).after('<div class="col-md-1 invalid-value-error"><i class="fa fa-exclamation fa-2x"></i></div>');
	      $(".invalid-value-error").attr({'data-toggle': "tooltip", 'data-placement': "top", 'title': validation[1]});
	      $(function () {
	        $('[data-toggle="tooltip"]').tooltip({container: 'body'})
	      });
	      $(".btn.save").addClass("disabled");
	    },

	    handleValidParam: function (element) {
	      $(element).removeClass("invalid");
	      $(".invalid-value-error").remove();
	      $(".btn.save").removeClass("disabled");
	    },

	    validateNumber: function (value, param_name) {
	      var errormsg,
	          locale = localeValidation,
	          isNumber = parseInt(value);
	      if (_.isNaN(isNumber)) {
	        errormsg = locale.number['notNumber'];
	        return ["invalid", errormsg];
	      } else if (isNumber < 0) {
	        errormsg = locale.number['negative'];
	        return ["invalid", errormsg];
	      } else if (param_name === "fill-opacity" || param_name === "stroke-opacity") {
	        if (value >= 0 && value <=1) {
	          return ["valid"];
	        } else {
	          errormsg = locale.number['invalidOpacity'];
	          return ["invalid", errormsg];
	        }
	      } else {
	        return ["valid"];
	      }
	    },

	    validateColor: function (value) {
	      var errormsg,
	          locale = localeValidation;
	      if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value) === false) {
	        errormsg = locale.color['notValid'];
	        return ["invalid", errormsg];
	      } else {
	        return ["valid"];
	      }
	    },

	    validateUrl: function (value) {
	      var errormsg,
	          urltest,
	          locale = localeValidation;

	      //urltest:
	      // Copyright (c) 2010-2013 Diego Perini (http://www.iport.it)
	      //
	      // Permission is hereby granted, free of charge, to any person
	      // obtaining a copy of this software and associated documentation
	      // files (the "Software"), to deal in the Software without
	      // restriction, including without limitation the rights to use,
	      // copy, modify, merge, publish, distribute, sublicense, and/or sell
	      // copies of the Software, and to permit persons to whom the
	      // Software is furnished to do so, subject to the following
	      // conditions:
	      //
	      // The above copyright notice and this permission notice shall be
	      // included in all copies or substantial portions of the Software.
	      //
	      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	      // EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	      // OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	      // NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	      // HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	      // WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	      // FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	      // OTHER DEALINGS IN THE SOFTWARE.

	      urltest = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i

	      if (urltest.test(value) === false) {
	        errormsg = locale.url['notValid'];
	        return ["invalid", errormsg];
	      } else {
	        return ["valid"];
	      }
	    },

	    validateLinecap: function (value) {
	      var errormsg,
	          locale = localeValidation;
	      if (value === "butt" || value === "round" || value === "square") {
	        return ["valid"];
	      } else {
	        errormsg = locale.select['invalidLinecap'];
	        return ["invalid", errormsg];
	      }
	    },

	    validateGraphicsymbol: function (value) {
	      var errormsg,
	          locale = localeValidation;
	      if (value === "circle" || value === "square" || value === "triangle" || value === "star" || value === "cross" || value === "x" || value === "external") {
	        return ["valid"];
	      } else {
	        errormsg = locale.select['invalidGraphic'];
	        return ["invalid", errormsg];
	      }
	    },

	    validateLinejoin: function (value) {
	      var errormsg,
	          locale = localeValidation;
	      if (value === "mitre" || value === "round" || value === "bevel") {
	        return ["valid"];
	      } else {
	        errormsg = locale.select['invalidLinejoin'];
	        return ["invalid", errormsg];
	      }
	    },

	    validateFontFamily: function (value) {
	      var errormsg,
	          locale = localeValidation;
	      if (value === "Arial" || value === "Geneva" || value === "sans-serif" || value === "Verdana") {
	        return ["valid"];
	      } else {
	        errormsg = locale.select['invalidFontfamily'];
	        return ["invalid", errormsg];
	      }
	    },

	    validateFontWeight: function (value) {
	      var errormsg,
	          locale = localeValidation;
	      if (value === "normal" || value === "bold") {
	        return ["valid"];
	      } else {
	        errormsg = locale.select['invalidFontweight'];
	        return ["invalid", errormsg];
	      }
	    },

	    validateFontStyle: function (value) {
	      var errormsg,
	          locale = localeValidation;
	      if (value === "normal" || value === "italic" || value === "oblique") {
	        return ["valid"];
	      } else {
	        errormsg = locale.select['invalidFontstyle'];
	        return ["invalid", errormsg];
	      }
	    },
	};
});