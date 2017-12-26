var InlineEditor = function () {
	this._fragement = '';
	this._overlayElement = '';
	this._overlayContentElement = '';
	this._overlayContentButtons = '';
	this._activeCell = '';
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
	}
};

InlineEditor.prototype._openOverlay = function () {
	this._attachOverlayToCell();
};

InlineEditor.prototype._attachOverlayToCell = function () {
	var cellContent = this._activeCell.innerHTML;
	this._overlayContentElement.innerHTML = cellContent;
	this._fragement.appendChild(this._overlayElement);
	this._activeCell.appendChild(this._fragement);
};

InlineEditor.prototype._bindButtonsHandlers = function () {
	[].forEach.call(this._overlayContentButtons, function(button){
		var tagName = button.getAttribute('data-tag');
		button.addEventListener('mousedown', function (e) {
			var selection = window.getSelection();
			if (selection.rangeCount) {
				var command;

				switch(tagName) {
					case 'b':
						command = 'bold';
						break;
					case 'i':
						command = 'italic';
						break;
					case 'u':
						command = 'underline';
						break;
				}
				document.execCommand(command , false, null);
				// var selectedText = range.cloneContents();
				// range.deleteContents();
				// var replacementText = document.createElement(tagName);
				// replacementText.appendChild(selectedText);
				// range.insertNode(replacementText);
			}
		});
	});
};

InlineEditor.prototype._defineElements = function (frag) {
	this._overlayContentElement = frag.querySelector('.inline-editor-content');
	this._overlayContentButtons = frag.querySelectorAll('.inline-editor-button');
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

window.inlineEditor = new InlineEditor();
