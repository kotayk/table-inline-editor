var table = document.querySelector('table');


table.addEventListener('dblclick', function(e) {
	if(e.target && e.target.nodeName == 'TD') {
		window.inlineEditor.openInstance(e.target);
	}
});

