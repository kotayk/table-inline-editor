var InlineEditor = function () {
	this._fragement = '';
	this._overlayElement = '';
	this._overlayContentElement = '';
	this._overlayContentButtons = '';
	this._overlayContentLinkContainer = '';
	this._overlayButtonsContainer = '';
	this._overlayContentLinkInput = '';
	this._overlayContentLinkInputSubmit = '';
	this._overlayContentLinkInputSubmitBack = '';
	this._activeCell = '';
	this._persistedRange = '';
	this.init();
};

InlineEditor.prototype.init = function () {
	var templateHTML = document.getElementById('inlineEditorOverlay').innerHTML;
	this._overlayElement = document.createElement('div');
	this._overlayElement.classList.add('inline-editor-instance');
	this._overlayElement.innerHTML = templateHTML;
	this._fragement = document.createDocumentFragment();
	this._fragement.appendChild(this._overlayElement);
	this._defineElements(this._fragement);
	this._bindButtonsHandlers();


	document.addEventListener('click', function(e) {
		this.closeInstance();
	}.bind(this));
	this._overlayElement.addEventListener('click', function(e) {
		e.stopPropagation();
	}.bind(this));
};

InlineEditor.prototype.openInstance = function (cell) {
	this.closeInstance();
	this._activeCell = cell;
	this._openOverlay();
};

InlineEditor.prototype.closeInstance = function () {
	if (this._activeCell) {
		var content = this._getContentFromOverlay();
		this._cleanContentInOverlay();
		this._detachOverlayFromCell();
		this._saveContentToCell(content);
		this._deselectActiveCell();
		this._closeCreateLinkDialog();
		this._showMainButtons();
	}
};

InlineEditor.prototype._openOverlay = function () {
	this._attachOverlayToCell();
	setTimeout(function(){window.getSelection().removeAllRanges()}, 0);
};

InlineEditor.prototype._attachOverlayToCell = function () {
	var cellContent = this._activeCell.innerHTML;
	this._overlayContentElement.innerHTML = cellContent;
	this._fragement.appendChild(this._overlayElement);
	this._activeCell.appendChild(this._fragement);
};

InlineEditor.prototype._bindButtonsHandlers = function () {
	var _self = this;
	[].forEach.call(this._overlayContentButtons, function(button){
		var tagName = button.getAttribute('data-tag');
		button.addEventListener('mousedown', function (e) {
			var selection = window.getSelection();
			if (selection.rangeCount) {
				var command;
				var param;

				switch(tagName) {
					case 'b':
						command = 'bold';
						param = null;
						document.execCommand(command, false, param);
						break;
					case 'i':
						command = 'italic';
						param = null;
						document.execCommand(command, false, param);
						break;
					case 'u':
						command = 'underline';
						param = null;
						document.execCommand(command, false, param);
						break;
					case 'ol':
						command = 'insertOrderedList';
						param = null;
						document.execCommand(command, false, param);
						break;
					case 'ul':
						command = 'insertUnorderedList';
						param = null;
						document.execCommand(command, false, param);
						break;
					case 'jl':
						command = 'justifyLeft';
						param = null;
						document.execCommand(command, false, param);
						break;
					case 'jc':
						command = 'justifyCenter';
						param = null;
						document.execCommand(command, false, param);
						break;
					case 'jf':
						command = 'justifyFull';
						param = null;
						document.execCommand(command, false, param);
						break;
					case 'jr':
						command = 'justifyRight';
						param = null;
						document.execCommand(command, false, param);
						break;
					case 'link':
						command = 'createLink';
						param = 'https://ya.ru';
						_self._persistedRange = selection.getRangeAt(0);
						_self._handleLinkDialog();
						break;
				}

				// var selectedText = range.cloneContents();
				// range.deleteContents();
				// var replacementText = document.createElement(tagName);
				// replacementText.appendChild(selectedText);
				// range.insertNode(replacementText);
			}
		});
	});

	this._overlayContentLinkInputSubmitBack.addEventListener('click', function (e) {
		_self._closeCreateLinkDialog();
		_self._showMainButtons();
	});

	this._overlayContentLinkInputSubmit.addEventListener('click', function (e) {
		console.log(_self._persistedRange);
		var inputValue = _self._overlayContentLinkInput.value;
		var selection = window.getSelection();
		// if (!_self._persistedRange) {
		// 	_self._persistedRange = selection.getRangeAt(0);
		// } else {
			selection.removeAllRanges();
			selection.addRange(_self._persistedRange);
		// }

		document.execCommand('createLink', false, inputValue.toString());
		_self._persistedRange = '';
		_self._closeCreateLinkDialog();
		_self._showMainButtons();
	});
};

InlineEditor.prototype._defineElements = function (frag) {
	this._overlayContentElement = frag.querySelector('.inline-editor-content');
	this._overlayContentLinkContainer = frag.querySelector('.inline-editor-link');
	this._overlayContentLinkInput = frag.querySelector('.inline-editor-link-input');
	this._overlayContentLinkInputSubmit = frag.querySelector('.inline-editor-button-submit-link');
	this._overlayContentLinkInputSubmitBack = frag.querySelector('.inline-editor-button-submit-link-back');
	this._overlayContentButtons = frag.querySelectorAll('.inline-editor-button');
	this._overlayButtonsContainer = frag.querySelector('.inline-editor-controls');
};

InlineEditor.prototype._getContentFromOverlay = function () {
	return this._overlayContentElement.innerHTML;
};

InlineEditor.prototype._cleanContentInOverlay = function () {
	this._overlayContentElement.innerHTML = '';
};

InlineEditor.prototype._detachOverlayFromCell= function () {
	this._activeCell.removeChild(this._overlayElement);
};

InlineEditor.prototype._saveContentToCell= function (content) {
	this._activeCell.innerHTML = content;
};

InlineEditor.prototype._deselectActiveCell = function () {
	this._activeCell = '';
};

InlineEditor.prototype._hideMainButtons = function () {
	this._overlayButtonsContainer.style.display = 'none';
};

InlineEditor.prototype._showMainButtons = function () {
	this._overlayButtonsContainer.style.display = 'block';
};

InlineEditor.prototype._handleLinkDialog = function () {
	this._hideMainButtons();
	this._openCreateLinkDialog();
	// if (this._overlayContentLinkContainer.style.display == 'none') {
	// 	this._showCreateLinkDialog()
	// } else {
	// 	this._hideCreateLinkDialog();
	// }
};

InlineEditor.prototype._closeCreateLinkDialog = function () {
	this._overlayContentLinkInput.value = '';
	this._hideCreateLinkDialog();
};

InlineEditor.prototype._hideCreateLinkDialog = function () {
	this._overlayContentLinkContainer.style.display = 'none';
};

InlineEditor.prototype._openCreateLinkDialog = function () {
	this._showCreateLinkDialog();
};

InlineEditor.prototype._showCreateLinkDialog = function () {
	this._overlayContentLinkContainer.style.display = 'block';
};

window.inlineEditor = new InlineEditor();
