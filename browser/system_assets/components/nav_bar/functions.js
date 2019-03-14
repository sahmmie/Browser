let {controls} = require('./system_assets/components/nav_bar/controls.js'),
	tabbar = require('./system_assets/modules/OhHaiBrowser.Tabbar.js'),
	AboutMenu = require('./system_assets/scripts/addons/about.js'),
	SettingsMenu = require('./system_assets/scripts/addons/settings.js'),
	UrlService = require('./system_assets/services/navbar.js'),
	MegaOverFlowContent = document.getElementById('MegaMenuContent'),
	Contextuals = require('./system_assets/modules/Contextuals/Contextuals.js');

$(function () {
	$('#VideoPlayer').draggable({
		containment: 'parent'
	});
});

controls.btn_ToggleTabBar.addEventListener('click', () => {
	tabbar.toggle();
});
controls.btn_back.addEventListener('click', () => {
	OhHaiBrowser.tabs.activePage.goBack();
});
controls.btn_refresh.addEventListener('click', () => {
	OhHaiBrowser.tabs.activePage.reload();
});
controls.btn_forward.addEventListener('click', () => {
	OhHaiBrowser.tabs.activePage.goForward();
});
//=========================================================================================================================
//Left Controls
//-------------------------------------------------------------------------------------------------------------------------
tabbar.panel.addEventListener('contextmenu', (e) => {
	switch (e.target.className) {
	case 'CommandBtn AddTab':
	case 'OhHai-TabMenu':
		//Everythig which isnt a tab
		var TbMen = OhHaiBrowser.ui.contextmenus.tabmenu();
		e.preventDefault();
		TbMen.popup(remote.getCurrentWindow());
		break;
	}
}, false);

function AddTabButton() {
	OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage, undefined, {
		selected: true
	});
}

//--------------------------------------------------------------------------------------------------------------
//URL bar functions
controls.txt_urlbar.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	var URlMenu = OhHaiBrowser.ui.contextmenus.urlbar(controls.txt_urlbar);
	URlMenu.popup(remote.getCurrentWindow());
}, false);

let urlbarValid = {};
controls.txt_urlbar.addEventListener('keydown', function (event) {
//Check validity of URL content
	UrlService(this.value, (resp) => {
		urlbarValid = resp;
	});
	//On Enter
	if (event.which == 13) {
		OhHaiBrowser.tabs.activePage.navigate(urlbarValid.output);
	}
});

//mouse event
controls.txt_urlbar.addEventListener('click', () => {
	if (controls.txt_urlbar.value != controls.txt_urlbar.getAttribute('data-text-swap')) {
		controls.txt_urlbar.value = controls.txt_urlbar.getAttribute('data-text-swap');
	}
});

controls.txt_urlbar.addEventListener('focus', () => {
	controls.div_urlOuter.classList.add('CenterFocus');
});

controls.txt_urlbar.addEventListener('focusout', () => {
	controls.txt_urlbar.value = controls.txt_urlbar.getAttribute('data-text-original');
	controls.div_urlOuter.classList.remove('CenterFocus');
});


//-----------------------------------------------------------------------------------------------------

controls.btn_bookmarked.addEventListener('click', function (e) {
	var popuplocation = {
		'left': e.currentTarget.offsetLeft,
		'top': e.currentTarget.offsetTop
	};
	if (controls.btn_bookmarked.classList.contains('QuicklinkInactive')) {
		//Add new bookmark
		controls.OhHaiBrowser.tabs.getCurrent(function (cTab) {
			var CurrentWebView = document.getElementById(cTab.getAttribute('data-container'));
			controls.OhHaiBrowser.bookmarks.add(CurrentWebView.getTitle(), CurrentWebView.getURL(), '', '', popuplocation, function (newqlink) {});
		});
	} else {
		//Remove bookmark
		var ThisId = Number(controls.btn_bookmarked.getAttribute('data-id'));
		Quicklinks.Remove(ThisId, function (e) {
			if (e != 0) {
				controls.btn_bookmarked.setAttribute('data-id', '');
				controls.btn_bookmarked.classList.remove('QuicklinkActive');
				controls.btn_bookmarked.classList.add('QuicklinkInactive');
			}
		});
	}
});

//Right Controls
//-------------------------------------------------------------------------------------------------------------------------
controls.btn_overflow.addEventListener('click',() => {
	new Contextuals.menu([
		{title:'New tab', tip:'', icon:'/', onclick:() => {
			OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage,undefined,{selected: true});
		}},
		{title:'New incognito tab', tip:'', icon:'/', onclick:() => {
			OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage,undefined,{selected: true,mode:'incog'});
		}},
		{seperator:true},
		{title:'Settings', tip:'', icon:'/', onclick:() => {
			menu.mega(SettingsMenu(),'Settings');
		}},
		{title:'About', tip:'', icon:'/', onclick:() => {
			menu.mega(AboutMenu(),'OhHai Browser');
		}}
	]);
});


OhHaiBrowser.ui.overflowmenu.panel.addEventListener('click', function (e) {
	e.stopPropagation();
});

document.addEventListener('click',() => {
	OhHaiBrowser.ui.overflowmenu.setvis(false);
});

var menu = {
	mega: function (loadfunction, MenuTitle) {

		if (MegaOverFlowContent.lastChild) {
			MegaOverFlowContent.removeChild(MegaOverFlowContent.lastChild);
		}

		OhHaiBrowser.ui.overflowmenu.items.overflowDeepMenuTitle.textContent = MenuTitle;
		//Load content into menu area
		MegaOverFlowContent.appendChild(loadfunction);

		//Show menu area
		OhHaiBrowser.ui.overflowmenu.items.overflowOptionsMenu.style.display = 'none';
		OhHaiBrowser.ui.overflowmenu.items.overflowDeepMenu.style.display = '';
	},
	hide: function () {
		OhHaiBrowser.ui.overflowmenu.items.overflowDeepMenu.style.display = 'none';
		OhHaiBrowser.ui.overflowmenu.items.overflowOptionsMenu.style.display = '';
		MegaOverFlowContent.removeChild(MegaOverFlowContent.lastChild);
	}
};



function initAccordion(accordionElem) {
//when panel is clicked, handlePanelClick is called.          
	function handlePanelClick(event) {
		showPanel(event.currentTarget);
	}
	//Hide currentPanel and show new panel.  
	function showPanel(panel) {
		//Hide current one. First time it will be null. 
		var expandedPanel = accordionElem.querySelector('.acc_active');
		if (expandedPanel) {
			expandedPanel.classList.remove('acc_active');
		}
		//Show new one
		panel.classList.add('acc_active');
	}
	var allPanelElems = accordionElem.querySelectorAll('.acc_panel');
	for (var i = 0, len = allPanelElems.length; i < len; i++) {
		allPanelElems[i].addEventListener('click', handlePanelClick);
	}
	//By Default Show first panel
	showPanel(allPanelElems[0]);
}
initAccordion(document.getElementById('leftAccordion'));