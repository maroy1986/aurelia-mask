System.register([], function(exports_1) {
    var _maskers, maskDefinitions, Masker;
    function getMasker(format, bindMasking, _placeholder) {
        if (_placeholder === void 0) { _placeholder = null; }
        var maskers = _maskers;
        var bindPlaceholdersIx = bindMasking ? 1 : 0;
        var placeholder = _placeholder || "_";
        if (!maskers[bindPlaceholdersIx]) {
            maskers[bindPlaceholdersIx] = {};
        }
        maskers = maskers[bindPlaceholdersIx];
        if (!maskers[placeholder]) {
            maskers[placeholder] = {};
        }
        maskers = maskers[placeholder];
        if (!maskers[format]) {
            maskers[format] = new Masker(format, bindMasking, placeholder);
        }
        return maskers[format];
    }
    exports_1("getMasker", getMasker);
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function isString(myVar) {
        return (typeof myVar === 'string' || myVar instanceof String);
    }
    return {
        setters:[],
        execute: function() {
            _maskers = {};
            maskDefinitions = {
                '9': /\d/,
                'A': /[a-zA-Z]/,
                '*': /[a-zA-Z0-9]/
            };
            Masker = (function () {
                function Masker(maskFormat, bindMasking, placeholder) {
                    this.maskFormat = maskFormat;
                    this.bindMasking = bindMasking;
                    this.maskCaretMap = [];
                    this.maskPatterns = [];
                    this.maskPlaceholder = '';
                    this.minRequiredLength = 0;
                    this.maskComponents = null;
                    this.maskProcessed = false;
                    this.placeholder = placeholder;
                    this.processRawMask();
                }
                Masker.prototype.unmaskValue = function (value) {
                    if (this.bindMasking) {
                        return this._maskValue(value, true);
                    }
                    return this._unmaskValue(value);
                };
                Masker.prototype.maskValue = function (unmaskedValue) {
                    if (isNumeric(unmaskedValue)) {
                        unmaskedValue = "" + unmaskedValue;
                    }
                    return this._maskValue(unmaskedValue, false);
                };
                Masker.prototype.maxCaretPos = function (value) {
                    var valueLength = -1;
                    if (isString(value)) {
                        valueLength = value.length;
                    }
                    else if (isNumeric(value)) {
                        valueLength = ("" + value).length;
                    }
                    if (this.bindMasking) {
                        if (this.maskCaretMap.indexOf(valueLength) != -1 ||
                            valueLength === this.maskFormat.length) {
                            return valueLength;
                        }
                        else {
                            for (var i = 0; i < this.maskCaretMap.length; i++) {
                                if (this.maskCaretMap[i] > valueLength) {
                                    return this.maskCaretMap[i];
                                }
                            }
                            return this.maskCaretMap.slice().shift();
                        }
                    }
                    else {
                        var caretPosMax = this.maskCaretMap[valueLength] || this.maskCaretMap.slice().shift();
                        return caretPosMax;
                    }
                };
                Masker.prototype.minCaretPos = function () {
                    return this.maskCaretMap[0];
                };
                Masker.prototype._unmaskValue = function (value) {
                    var valueUnmasked = '', maskPatternsCopy = this.maskPatterns.slice();
                    value = value.toString();
                    this.maskComponents.forEach(function (component) {
                        value = value.replace(component, '');
                    });
                    value.split('').forEach(function (chr) {
                        if (maskPatternsCopy.length && maskPatternsCopy[0].test(chr)) {
                            valueUnmasked += chr;
                            maskPatternsCopy.shift();
                        }
                    });
                    return valueUnmasked;
                };
                Masker.prototype._maskValue = function (unmaskedValue, keepMasking) {
                    var input = unmaskedValue || '';
                    var valueMasked = '', maskCaretMapCopy = this.maskCaretMap.slice(), maskPatternsCopy = this.maskPatterns.slice();
                    if (keepMasking) {
                        input = this._unmaskValue(input);
                    }
                    function putMaybe(chr) {
                        if (!keepMasking || input.length > 0) {
                            valueMasked += chr;
                        }
                    }
                    function putNextInput() {
                        valueMasked += input.charAt(0);
                    }
                    function nextCharMatches() {
                        return maskPatternsCopy[0].test(input.charAt(0));
                    }
                    function advanceInput() {
                        input = input.substr(1);
                    }
                    function advanceCaretMap() {
                        maskCaretMapCopy.shift();
                    }
                    function advancePatterns() {
                        maskPatternsCopy.shift();
                    }
                    this.maskPlaceholder.split('').forEach(function (chr, i) {
                        if (input.length > 0 && i === maskCaretMapCopy[0]) {
                            if (maskPatternsCopy.length) {
                                while (input.length > 0 && !nextCharMatches()) {
                                    advanceInput();
                                }
                            }
                            if (maskPatternsCopy.length && nextCharMatches()) {
                                putNextInput();
                                advanceCaretMap();
                                advancePatterns();
                            }
                            else {
                                putMaybe(chr);
                                maskCaretMapCopy.shift();
                            }
                            advanceInput();
                        }
                        else {
                            if (input.length > 0 && input.charAt(0) === chr) {
                                advanceInput();
                            }
                            putMaybe(chr);
                        }
                    });
                    return valueMasked;
                };
                Masker.prototype.processRawMask = function () {
                    var _this = this;
                    var characterCount = 0;
                    if (isString(this.maskFormat)) {
                        var isOptional = false, numberOfOptionalCharacters = 0, splitMask = this.maskFormat.split('');
                        splitMask.forEach(function (chr, i) {
                            if (maskDefinitions[chr]) {
                                _this.maskCaretMap.push(characterCount);
                                _this.maskPlaceholder += _this.getPlaceholderChar(i - numberOfOptionalCharacters);
                                _this.maskPatterns.push(maskDefinitions[chr]);
                                characterCount++;
                                if (!isOptional) {
                                    _this.minRequiredLength++;
                                }
                                isOptional = false;
                            }
                            else if (chr === '?') {
                                isOptional = true;
                                numberOfOptionalCharacters++;
                            }
                            else {
                                _this.maskPlaceholder += chr;
                                characterCount++;
                            }
                        });
                    }
                    this.maskCaretMap.push(this.maskCaretMap.slice().pop() + 1);
                    this.getMaskComponents();
                    this.maskProcessed = this.maskCaretMap.length > 1 ? true : false;
                };
                Masker.prototype.getMaskComponents = function () {
                    var maskPlaceholderChars = this.maskPlaceholder.split(''), maskPlaceholderCopy;
                    if (this.maskCaretMap && !isNaN(this.maskCaretMap[0])) {
                        this.maskCaretMap.forEach(function (value) {
                            maskPlaceholderChars[value] = '_';
                        });
                    }
                    maskPlaceholderCopy = maskPlaceholderChars.join('');
                    this.maskComponents = maskPlaceholderCopy.replace(/[_]+/g, '_').split('_');
                };
                Masker.prototype.getPlaceholderChar = function (i) {
                    var defaultPlaceholderChar = this.placeholder;
                    return (defaultPlaceholderChar.toLowerCase() === 'space') ? ' ' : defaultPlaceholderChar[0];
                };
                return Masker;
            })();
            exports_1("Masker", Masker);
        }
    }
});
//# sourceMappingURL=masker.js.map